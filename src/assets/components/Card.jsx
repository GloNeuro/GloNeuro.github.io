import React from 'react'
import "./Card.css"

const Card = ({ title, excerpt }) => {
    return (
        <>
            <div className="card" style={{overflow: "hidden"}}>
                <h3 dangerouslySetInnerHTML={{ __html: title }} />
                {/* <div dangerouslySetInnerHTML={{ __html: excerpt }} /> */}
            </div>
        </>
    )
}

export default Card
