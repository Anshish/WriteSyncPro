var pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

var conString = process.env.PG_URL //Can be found in the Details page
console.log(conString);

const client=new pg.Client(conString)

const connect=async ()=>{
  try {
    await client.connect()
    try {
      const result=await client.query('SELECT * from documents')
      console.log('during connect',result.rows);
    } catch (error) {
      console.log('Error running query for connection',error);
    }
  } catch (error) {
    console.error('Could not connect to Postgres:', error);
  }
}

const findDocument=async(id)=>{
  if(!id) return null;
  console.log('Finding or creating document:', id);
  // console.log('Default value:', defaultValue);
  
  try{
    // let textData;

    // // Check if defaultValue is an empty string
    // if (defaultValue.trim() === '') {
    //   textData = ''; // or set it to an appropriate default value
    // } else {
    //   textData = defaultValue;
    // }

    // console.log('Text data', textData);

    const result= await client.query('SELECT * FROM documents WHERE _id=$1',[id])
    console.log('Documents found. No need to create table:', result.rows[0]);
    return result.rows[0];
    // if(result.rows && result.rows.length > 0){
    //   console.log('Documents found. No need to create table:', result.rows[0]);
    //   return result.rows[0];
    // }else{
    //   const createTable=await client.query('INSERT INTO documents (_id,data) VALUES ($1,$2) RETURNING *',[id,textData]);
    //   console.log('Documents created. New table created:', createTable.rows[0]);
    //   return createTable.rows[0]
    // }
  }catch(error){
    console.error('Error finding or creating document:', error);
    throw error; // Re-throw the error for further handling
  }
}


const saveDocument=async(documentId,data)=>{
  console.log('Saving document:', documentId);
  console.log('Data for saving:', data);

  try {
    // Check if 'data' is undefined or an empty string
    if (data === undefined) {
      console.log('Received empty data. Skipping saveDocument.');
      return;
    }

    await client.query('UPDATE documents SET data=$2 WHERE _id=$1',[documentId,data])
    console.log('Document saved successfully!');
  } catch (error) {
    console.error('Error saving document:', error);
  }
}


const getDocuments=async()=>{
  try {
    const result=await client.query('SELECT * FROM documents')
    console.log('getDocuments:',result.rows);
    return result.rows
  } catch (error) {
    console.log('Error running query for getDocuments',error);
  }
}

const createDocument=async(title,_id)=>{ 
  const defaultValue=""
  try {
    const result=await client.query('INSERT INTO documents (_id,title,data) VALUES ($1,$2,$3) RETURNING *',[_id,title,defaultValue])
    return result.rows
  } catch (error) {
    console.log('Error running query for createDocument',error);
  }
}

module.exports={connect,findDocument,saveDocument,getDocuments,createDocument}
