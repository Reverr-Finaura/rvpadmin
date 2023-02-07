import React from 'react'
import { HourglassSplit } from 'react-bootstrap-icons'
import styles from "./SendFormToFonder.module.css"

const SendFormToFonder = ({setSendFormData,handleClick,setSendFormClick,isSendingFormBegin}) => {

const handleInputChange=(e)=>{
    const {name,value}=e.target
    setSendFormData((prev)=>{
return {...prev,[name]:value}
    })
}

  return (
 <>
<section className={styles.outerCont}>
<div className={styles.innerCont}>

    <form onSubmit={handleClick} className={styles.form}>
        <input onChange={handleInputChange} className={styles.input} type="text" name='name' placeholder='Founder Name' required/>
        <input onChange={handleInputChange} className={styles.input} type="email" name='email' placeholder='Founder Email' required />
        <div className={styles.btnCont}>
        <button onClick={()=>setSendFormClick(false)} className={styles.btn} type='submit'>Cancel</button>
       {isSendingFormBegin?<HourglassSplit />:<button className={styles.btn} type='submit'>Send</button>} 
        </div>
        
    </form>
</div>
</section>
 </>
  )
}

export default SendFormToFonder