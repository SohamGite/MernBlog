import { useEffect, useState } from "react"
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link,Navigate } from "react-router-dom";
import { useParams } from "react-router-dom"
import { formatISO9075 } from "date-fns";

export default function PostPage(){
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();
    const [redirect,setRedirect] = useState(false)

    useEffect(() => {
      fetch(`http://localhost:4000/post/${id}`)
        .then(response => {
          response.json().then(postInfo => {
            setPostInfo(postInfo);
          });
        });
    }, [id]);

    if(!postInfo) return "";

    const handleDelete = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (confirmDelete) {
        const response = await fetch(`http://localhost:4000/post/${id}`, {
          method: 'DELETE',
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          setRedirect(true)
        } else {
          alert("Failed to delete the post.");
        }
      }
    }
    if (redirect) {
      return <Navigate to={'/'} />
    }

    return(
      <div className="post-page">
        <h1>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className="author">by @ {postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
          <div>
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit this Post
            </Link>
          </div>
          <div className="delete-row">
            <button className="delete-btn" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Delete this Post
            </button>
            </div>
          </div>
        )}
        <div className="image">
          <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
        </div>
        <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      </div>
    )
}
