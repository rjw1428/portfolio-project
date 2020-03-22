import React, { Component } from 'react';
import './ProjectIndicator.css'

const projectIndicator = (props) => (
    <div className="project-wrapper">
        <h2 onClick={()=> window.location.assign(props.link)}>{props.name}</h2>
    </div> 
) 

export default projectIndicator