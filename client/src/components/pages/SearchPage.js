import React, { useState, useEffect } from 'react'
import axios from 'axios'

function SearchPage({history}) {

    useEffect(()=> {
        if(!localStorage.getItem("authToken")) {
            history.push("/login")
        }

    }, [history])

    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        history.push("/login")
    }

    return (
        <div>
            SEARCH PAGE
            <button onClick={logoutHandler} />
        </div>
    )
}

export default SearchPage
