import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import SERVER_URL from '../../configure';
import {v4 as uuidv4} from 'uuid';
import { useNavigate} from 'react-router-dom';


const Home = () => {
    const navigate=useNavigate();

    const [documents, setDocuments] = useState([]);
    const [newDocumentTitle, setNewDocumentTitle] = useState('');

    const handleCreateDocument=async()=>{
        const _id=uuidv4();
        try {
            const response=await axios.post(`${SERVER_URL}/create-document`,{
                title:newDocumentTitle,
                _id:_id,
            })
            console.log('new document created',response.data);
            setNewDocumentTitle('');
            navigate(`/documents/${_id}`);
        } catch (error) {
            console.log('error',error);
        }
    }

    const fetchDocuments=async()=>{
        try {
            const response=await axios.get(`${SERVER_URL}/documents`)
            setDocuments(response.data);
            console.log('response',response.data);
        } catch (error) {
            console.log('error',error);
        }
    }

    useEffect(()=>{
        fetchDocuments();
    },[])


    return (

        <div className='home-container'> 
            <h1 className='title'>Welcome to the WriteSync Pro</h1>
            <div className='list-container'>
                <h1 className='headers'>Document List</h1>
                <ul>
                    {documents.length > 0 &&
                    documents.map((document) => (
                        <li key={document._id}>
                        <Link to={`/documents/${document._id}`}>{document.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='list-container'>
                <h2 className='headers'>Create a New Document</h2>
                <input
                className='input-container'
                type="text"
                placeholder="Enter document title"
                value={newDocumentTitle}
                onChange={(e) => setNewDocumentTitle(e.target.value)}
                />
                <button className='button-container' onClick={handleCreateDocument}>Create Document</button>
            </div>
        </div>
    )
}

export default Home