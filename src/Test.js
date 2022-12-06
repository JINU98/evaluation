import logo from './logo.svg';
import './App.css';
import { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import Convert from 'ansi-to-html';
import examples from './evaluation';
import inference from './inferences';
import { CSVLink, CSVDownload } from "react-csv"


function Test() {

  var convert = new Convert();
  const [subreddit,setsubreddit]=useState("medical_advice")
  const [data,setData]=useState([])
  const [annotations,setAnnotations]=useState([])
  const [inferences,setInferences]=useState([])
  const [show, setShow] = useState(true);

  const [name,setName] = useState("");
  const [notation,setNotation]=useState([])
  
  const myRef1=useRef();
  const myRef2=useRef()
  
  const borderStyle={
    border:"2px solid black",
    cursor:"pointer"
  }

  const addEvaluation =(index,type,value,post)=>{
    const a={};
    if(type="annotation")
    {
      a["name"]=name;
      a["annoatation"]=value;
      a["index"]=index;
      a["post"]=post;
    }
   setNotation([...notation,a])
  }

  console.log("notation",notation)

  const rightclicked =(e,index,type,value,post)=>{


  

    addEvaluation(index,type,value,post)

    setData(data.filter((v,i)=>{
      if(i!=index){
        return v
      }
    }))
    // e.target.style.backgroundColor="green";

  }

  const wrongclicked=(e,index,type,value,post)=>{
  
  
    addEvaluation(index,type,value,post)

    setData(data.filter((v,i)=>{
      if(i!=index){
        return v
      }
    }))

    // e.target.style.backgroundColor="black";

  }

    const handleAgree=(e,index,type,value,post)=>{
      e.target.style.backgroundColor="green";
    addEvaluation(index,type,value,post)




    }

    const handleDisAgree=(e,index,type,value,post)=>{
      e.target.style.backgroundColor="black"
      addEvaluation(index,type,value,post)
    }




  const displayInference = (type)=>{

  

    if(type == "0"){
      return "None"
    }
    if(type == "1"){
      return "Indication or None"
    }
    if(type == "2"){
      return "Ideation"
    }
    if(type == "3"){
      return "Ideation"
    }
    if(type == "4"){
      return "Behavourial or attempt"
    }


  }

  const handleInferences = (inference)=>{

    let html=[];
    let infer=[];

    inference.map((val,ind)=>{
      // let ansi_up = new AnsiUp();
        // let html = ansi_up.ansi_to_html(val);
        // console.log("html",html)
        // return console.log(val[2])
        console.log("value index",val,ind)
        
          if(val==null){
            html.push(" ")
            infer.push("0")
          }
          else{
            html.push(convert.toHtml(val[2]))
            infer.push(val[0])
            
          }
          
        
        
      })
      console.log("html",html)
      setAnnotations(html)
      setInferences(infer)

  }

  const handlePosts = async (posts) => {
    await axios.get(`http://127.0.0.1:5000/get?posts=${posts}`)
          // .then((res)=>res.json())
          
          .then((res)=>{
            let html=[];
            let infer=[];
            res.data.map((val,ind)=>{
            // let ansi_up = new AnsiUp();
              // let html = ansi_up.ansi_to_html(val);
              // console.log("html",html)
              // return console.log(val[2])
              console.log("value index",val,ind)
              
                if(val==null){
                  html.push(" ")
                  infer.push("0")
                }
                else{
                  html.push(convert.toHtml(val[2]))
                  infer.push(val[0])
                  
                }
                
              
              
            })
            console.log("html",html)
            setAnnotations(html.map((value,index)=>{
              return value.replaceAll("span","div")
            }))
            setInferences(infer)
          })
        }

  // https://www.reddit.com/r/medical_advice/
  useEffect(() => {
    
    
    // fetch("https://www.reddit.com/r/" + subreddit +".json").then(
    //   res => {
    //     if (res.status !== 200) {
    //       console.warn("Warning: Something is wrong with the api.");
    //       return;
    //     }
    //     res.json().then(data => {
    //       if (data != null){
    //         let posts = []
    //         setData(data.data.children);
           

    //         posts = data.data.children.map((val)=>{
    //           return val?.data?.selftext.replaceAll("&amp;","and").replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
    //         })
    //         console.log("posts",posts)
    //         console.log("csv",examples.slice(0,200))
    //         handlePosts(JSON.stringify(posts,null,"||")) 
    //         console.log("data",data.data.children)
    //       }
    //     });
    //   }
    // )

    setData(examples.slice(0,200).map((val,index)=>{return val["Sentence"]}))
    // console.log("i",inference)
    handleInferences(inference)
    // setInferences(inference)
    // handlePosts(JSON.stringify(examples.slice(0,200).map((val,index)=>{return val["Sentence"]}),null,"||"))
    console.log("csv",JSON.stringify(examples.slice(0,200).map((val,index)=>{return val["Sentence"]}),null,"||"))
  }, [subreddit]);


  return (
    <div>
      <br/>
      <div style={{backgroundColor:"lightgreen",padding:"5px"}}>
      <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='Please add your name to start evaluation' />

      </div>

      <header>
    <br/>
    <br/>
    <p>
      Guidelines for evaluation:
      <br/>
      <br/>

      <ol>
        <li>
          <p>
            Add your name in the green higlighted bar as Step 1.
          </p>
        </li>
        <li>
          <p>
            Read the reddit posts and click on agree or disagree if you think the particular concept is present in the given concept color codes as the model higlightens.
          </p>
        </li>
        <li>
          <p>
            Click on the &nbsp;<img style={{cursor:"pointer"}} width={"35"} src="https://cdn-icons-png.flaticon.com/512/5290/5290119.png" alt="" />&nbsp; if you think the given inference is correct.
            Click on the &nbsp;<img style={{cursor:"pointer"}} width={"35"} src="https://cdn-icons-png.flaticon.com/512/7698/7698976.png" alt="" />&nbsp; if you think the given inference is incorrect.


          </p>
        </li>
        <li>
          <p>
            Continue till the list is exhausted.
          </p>
        </li>
      <li>
        <p>
    <b>  After finishing annotation please click this link to        <CSVLink data={notation}>Generate Report</CSVLink>;</b>
          
        </p>
      </li>
      </ol>
    

      </p>
    
  
        
        <h1>r/<input class="subreddit_input" onChange={e => setsubreddit(e.target.value)} value={subreddit} /></h1>


				</header>

        

      <section>

        {data.map((value,index)=>{

        //  return console.log(value?.data?.selftext)

        return <div key={index} style={{margin:"0 auto",width:"100%"}}>

        {/* { <span> Posted by : <strong> u/{value?.data?.author}</strong> &nbsp;<span> {value.data.author_flair_text}</span> </span>  } <span> {value?.data?.author_flair_text?.includes("Moderator")== true ? <i className="fa fa-star" style={{color:"red"}} aria-hidden="true"></i>: null   }  </span> */}
      
        { <span> Posted by : <strong> u/reddit_user  </strong>  </span>}
        
          
          <div style={{display:"flex",gap:"10px"}}>
          <div>
					<h3> Post #{data.length-index} </h3> 
          </div>

          <div>
            {
          // <p style={{backgroundColor:"grey",color:'white',margin:"1px",padding:"5px",fontSize:"12px",borderRadius:"10px"}} >{value.data.link_flair_text}</p>
          // <p style={{backgroundColor:"grey",color:'white',margin:"1px",padding:"5px",fontSize:"12px",borderRadius:"10px"}} >{value}</p>

}
      
            </div>
            
         
        

          </div>
              
          {/* <div>
            <source src={value?.data?.media?.scrubber_media_url} 
            width="640" height="480" frameborder="0" allowfullscreen>
          </source>
          </div> */}

              {/* <img src={value?.data?.thumbnail} style={{height: "200px"}} alt="" /> */}

          {
          <span> 
            {value}

            <br/>
            <br/>
            <div style={{color:"white",display:"inline-block"}} dangerouslySetInnerHTML={{__html: annotations[index+1] } } ></div>
           {  annotations[index+1] ==" " ? "":
            <div>
              <p>
                Do you agree with this evalution of cssrs concepts : 
              </p>
              <button onClick={(e)=>{ handleAgree(e,index,"concept","agree",value) }}>Agree</button>
              &nbsp; &nbsp;
              <button onClick={(e)=>{ handleDisAgree(e,index,"concept","disagree",value) }}>Disagree</button>
            </div>
        }

            {/* {annotations[index]} */}

            <div>
        

         
            </div>
            <div style={{display:"flex",margin:"2vh 0px",gap:"30px",alignContent:"center"}}>

            {/* <br/> */}
            <p style={{backgroundColor:"#f56a6a",color:'white',margin:"1px",padding:"5px",fontSize:"12px",borderRadius:"10px"}} >
            {displayInference(inferences[index])}


          </p>

            <div>
            {/* <p style={{backgroundColor:"white",color:'black',margin:"1px",padding:"5px",fontSize:"12px",borderRadius:"10px"}} >  </p> */}
          
           <img onClick={(e)=>{rightclicked(e,index,"annotation","correct",value)}} ref={myRef1} style={{cursor:"pointer"}} width={"35"} src="https://cdn-icons-png.flaticon.com/512/5290/5290119.png" alt="" />

         
            </div>
          <div> 

          <img width={"35"} onClick={(e)=>{wrongclicked(e,index,"annotation","incorrect",value)}} ref={myRef1} style={{cursor:"pointer"}} src="https://cdn-icons-png.flaticon.com/512/7698/7698976.png" alt="" />


          </div>


        
          </div>

           <p> <br/> <a href="#" target="_blank" className="button fit"><i className="fa fa-comments" aria-hidden="true"></i> Comments</a> </p> <hr className="major" /> </span>
           
           } 

   

        </div>
        
      
        })}  

        

      </section>

   
      

    </div>
  );
}

export default Test;
