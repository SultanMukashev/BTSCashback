import React, { ReactNode } from 'react';


export default interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}