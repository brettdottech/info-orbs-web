import React from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
}

const Card = ({children, className}: CardProps) => {
    return (
        <div className={`card ${className ? className : ''}`}>
            {children}
        </div>
    );
}

export default Card;