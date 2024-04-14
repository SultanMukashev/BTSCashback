import './App.css';
import MainPage from '../src/domains/MainPage/MainPage.js';
import LoginPage from './domains/LogInPage/LoginPage.js';
import CardEurasian from './assests/card-eurasian.svg';
import CardHalyk from './assests/card-halyk.svg';
import CardHomeCredit from './assests/card-home-credit.svg';
import CardJusan from './assests/card-jusan.svg'
import { useEffect, useState } from 'react';
import { API } from './shared/api.js';

const items = [
  { image: CardEurasian, title: 'Title 1', description: 'Description 1', bank: 'eurasian' },
  { image: CardHalyk, title: 'Title 2', description: 'Description 2' ,bank: 'halyk'},
  { image: CardHomeCredit, title: 'Title 3', description: 'Description 3' , bank: 'home'},
  { image: CardJusan, title: 'Title 4', description: 'Description 4' , bank: 'jusan'}
];

const App = () => {
  const [isAuth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function load() {
      let phone = await localStorage.getItem('phone');
      if (phone) {
        API.get(`/user/${phone}/`)
          .then((res) => {
            setAuth(true);
            setUser(res.data);
            API.get(`/user/${phone}/cards/`)
              .then((res) => setCards(res.data))
              .catch(() => {
                setCards([]);
              });
          })
          .catch(() => {
            setAuth(false);
            setUser({});
            setCards([]);
            localStorage.removeItem('phone');
          });
      }
    }
    load();
  }, []);

  return (
    <>
      {isAuth ? <MainPage user={user} items={items} /> : <LoginPage />}
    </>
  );
};

export default App;
