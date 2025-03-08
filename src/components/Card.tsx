import styles from './Card.module.css';

type CardProps = {
    children: React.ReactNode;
    className?: string;
}

const Card = ({children, className}: CardProps) => {
    return (
        <div className={`${styles['card']} ${className ? className : ''}`}>
            {children}
        </div>
    );
}

export default Card;