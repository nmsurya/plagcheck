
const callAI=async(prompt)=>{
    const res=await fetch(process.env.aiHOST,{
        method:"POST",
        headers:{
            'Content-type':"Application/json"
        },
        body: JSON.stringify(
        {
        "model":"deepseek-r1",
        "prompt":`${prompt} Just tell me how likely this content is AI generated. (in percentage) And tell me if this document gets accepted or rejected for academic publishing `,
        "max_tokens":256,
        "think": false,
        "stream":false
        })
    })
    const data=await res.json();
    return data?.response||"Something went wrong"
}

module.exports={callAI}