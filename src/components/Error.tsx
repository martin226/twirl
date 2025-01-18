import React from "react";

const Error = () => {
    const animationStyle: [string, number] = ['fadeIn', 0.5];

    const handleEmail = () => {
        window.location.href = "mailto:jeff.lu234@gmail.com?subject=JEFFFFFFFFFF WHAT ARE YOU DOING&body=Jeff... what the heck... I'm super disappointed in you and you better fix that project or you aren't getting the internship";
    };

    return (
        <div className="error-window" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f8d7da',
            border: '2px solid #f5c6cb',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            textAlign: 'center',
            animation: `${animationStyle[0]} ${animationStyle[1]}s`
        }}>
            <h1 style={{ fontFamily: 'Comic Sans MS', color: '#dc3545', fontSize: '3em', textShadow: '2px 2px #fff' }}>
                Heyy there!
            </h1>
            <p style={{ fontFamily: 'Arial', color: '#6c757d', fontSize: '1.5em', lineHeight: '1.5' }}>
                If you are seeing this, it means <span style={{ fontWeight: 'bold', color: '#007bff' }}>Jeff</span> has spotted a bug in the project and
                <span style={{ fontStyle: 'italic', color: '#28a745' }}> Jeff is working VERY hard right now to fix it.</span>
            </p>
            <p style={{ fontFamily: 'Courier New', color: 'red', fontSize: '1.8em', margin: '20px 0' }}>
                If you desperately need to see this project or just have a bad day,
            </p>
            <button onClick={handleEmail} style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '1.5em',
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'background-color 0.3s, transform 0.2s',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                Yell at Jeff!
            </button>
            <p style={{ fontFamily: 'Georgia', color: '#17a2b8', fontSize: '1.3em', marginTop: '20px' }}>
                (He loves getting yelled at, trust me!)
            </p>
        </div>
    );
};

export default Error;
