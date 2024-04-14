import styled from 'styled-components';
import InputProps from '../values/InputProps';


const StyledInput = styled.input`
width: 100%;
boxSizing: border-box;
border: 0px solid black;
height: 56px;
borderRadius: 16px;
-webkit-box-shadow: 0px 4px 91px -17px rgba(0,0,0,0.26);
-moz-box-shadow: 0px 4px 91px -17px rgba(0,0,0,0.26);
box-shadow: 0px 4px 91px -17px rgba(0,0,0,0.26);
`

const Input: React.FC<InputProps> = ({ icon, iconPosition, ...rest }) => {
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return <img src={icon} alt="icon" style={{ width: '20px', height: '20px' }} />;
        }
        return icon;
    };

    return (
        <div style={{ position: 'relative', margin: '20px' }}>
            {iconPosition === 'left' && icon && (
                <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }}>
                    {renderIcon()}
                </div>
            )}
            <StyledInput
                {...rest}
            />
            {iconPosition === 'right' && icon && (
                <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}>
                    {renderIcon()}
                </div>
            )}
        </div>
    );
};

export default Input;

