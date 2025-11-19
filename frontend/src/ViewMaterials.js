import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './StudentDashboardNav';
import { useCookies } from "react-cookie";

function ViewMaterials(){
    
    const [materials, setMaterials] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(["userData"]);

    async function fetchMaterials() {
        const u_id = cookies.userData.details[0]

        const res = await fetch("http://localhost:5000/api/fetchMaterials",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: 
                JSON.stringify({
                    "s_id":u_id
                }
            )
        });

        const data = await res.json();
        console.log(data["materials"])
        setMaterials(data["materials"])
        
        
    }

    useEffect(() => {
    fetchMaterials()
  },[])

  const titleKeys = Object.keys(materials);

    return(
        <>
        <Dashboard/>
        <div className='justify-items-center mt-10 text-3xl w-full'>
        <div className='bg-neutral-800 justify-items-center w-1/8 p-5 rounded-3xl outline-1 w-3/4'>
        <h1 className='text-4xl pb-5'>Materials</h1>

        {materials.length === 0 ? (<p></p>):
       (titleKeys.map (titleKey => (
        <div key={titleKey} className="gap-10 w-full justify-items-center" style={{ marginBottom: '1rem' }}>
            <details className='cursor-pointer hover:bg-green-600'>
              <summary className=''>{titleKey}</summary>            
              
              <div className='flex flex-col bg-neutral-800'>
                {materials[titleKey].map((material) => (

                <a href={material.link} key={material.m_id} target="_blank" className='p-5 hover:bg-green-600'>
                  {material.m_name}
                </a>
              ))}
              </div>
              
          </details>    
          </div>
        )))
        }
        </div></div>
        </>
    )
}

export default ViewMaterials;