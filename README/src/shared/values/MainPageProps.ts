import UserInformation from "./UserInformation";
import SwipeableCardProps from './SwipeableCardProps'

export default interface MainPageProps {
    user: UserInformation;
    items: SwipeableCardProps[];
}