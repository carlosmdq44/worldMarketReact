import React,{useState, useEffect, useContext} from 'react';
import { useParams } from "react-router-dom";
import { Card } from 'react-bootstrap';
import ItemCount from '../components/ItemCount';
import { CartContext } from '../context/CartContext';

const Detail = ({ item }) =>{
  let params = useParams();

function onAddCallBack(n){
  onAdd(n);
    alert(`agregados ${n} productos `);
}

const [data, setData] = useState([]);
const [isloading, setIsLoading] = useState(true);
const [err, setErr] = useState("");

const [goToCart, setGoToCart] = useState(false);
const { addToCart } = useContext(CartContext);

const onAdd = (quantity) => {
  setGoToCart(true)
  addToCart({...item, quantity: quantity})
}  

useEffect(() => {
    fetch('https://fakestoreapi.com/products/' + params.id)
    .then((res) => res.json())
    .then((json) => {
      setIsLoading(false);
      setData(json);
    })
    .catch((err) => {
      setErr("Ocurrio un error inesperado");
    });
  }, [params.id]); 

  return ( 
    <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src={data.image} />
    <Card.Body>
      <Card.Title>{data.title}</Card.Title>
      <Card.Text>
       {data.description}
      </Card.Text>
      <ItemCount 
       stock={5}
       initial={1} 
       onAdd = {onAddCallBack}
       />
    </Card.Body>
  </Card>
  ); 
};

export default Detail;