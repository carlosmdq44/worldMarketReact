import { useState, useContext } from 'react'
import { getFirestore, collection, addDoc, Timestamp} from 'firebase/firestore'
import { CartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'
import LoaderSecondary from '../../LoaderSecondary'

const FormBuyer = () => {

    const [orderId, setOrderId] = useState('')
    const [creatingOrder, setCreatingOrder] = useState(false)
    const [formData, setFormData] = useState({
        name:"", email:"", emailConfirm:"", phone:""
    })
    const { cartList, totalBuy, emptyCart } = useContext(CartContext)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value   
        })
    }

    const createOrder = (e) => {
        e.preventDefault();
        setCreatingOrder(true)
        delete formData.emailConfirm
        let order = {}
        order.date = Timestamp.fromDate(new Date())
        order.buyer = formData
        order.total = totalBuy()
        
        order.items = cartList.map(cartItem => {
            const id = cartItem.id
            const title = cartItem.title
            const price = cartItem.price
            const quantity = cartItem.quantity
            const totalPrice = cartItem.price * cartItem.quantity
            return {id, title, price, quantity, totalPrice}
        })


        const db = getFirestore()
        const orderCollection = collection(db, 'orders')
        addDoc(orderCollection, order)
        .then(resp => setOrderId(resp.id))
        .catch(err => console.log(err))
        .finally(() => { 
            setCreatingOrder(false)

            emptyCart()
            setFormData({
                name:"", email:"", emailConfirm:"", phone:""
            })
        })

    }

    return (
        <> 
            {creatingOrder
            ?
                <>      
                    <h4 className="mt-5 text-center">Processing your order, please wait a moment...</h4>
                    <LoaderSecondary />
                </>
            :
            orderId
            ? 
                <div className="container">
                    <div className="py-5 text-center mt-5">
                        <h2 className="mt-5">Thank you for choosing us!</h2>
                        <h4 className="my-5">The purchase has been made successfully</h4>
                        <strong>The ID of your purchase is {orderId}</strong><br />
                        <Link className="btn btn-danger bg-gradient mt-5" to={`/`}>
                            <strong>Go Back</strong>
                        </Link>
                    </div>
                </div>
            :
                <div className="container mt-5 form__container d-flex">
                    <div className="container align-self-center position-relative">
                        <div className="row">
                            <div className="col-12">
                                <form className="d-flex flex-column"
                                    onSubmit={createOrder}
                                    onChange={handleChange}
                                >
                                    <div className="contact table border border-dark mt-3" style={{width:'80%' , margin:'auto'}}>
                                    <div className="mb-3 d-flex flex-column align-items-center mt-1">
                                        <label className="form-label">Name</label>
                                        <input type="name" className="form-control form-control--color " name="name" placeholder="Pedrito Pedrazo" defaultValue={formData.name} required />
                                    </div>
                                    <div className="mb-3 d-flex flex-column align-items-center mt-1">
                                        <label className="form-label">Phone</label>
                                        <input type="number" className="form-control form-control--color" name="phone" placeholder="15xxxxxxxxx" defaultValue={formData.phone} required />
                                    </div>
                                    <div className="mb-3 d-flex flex-column align-items-center">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control form-control--color" name="email" placeholder="pedrito@ejemplo.com" defaultValue={formData.email} required />
                                    </div>
                                    <div className="mb-3 d-flex flex-column align-items-center">
                                        <label className="form-label">Email Confirm </label>
                                        <input type="email" className="form-control form-control--color" name="emailConfirm" placeholder="pedrito@ejemplo.com" defaultValue={formData.emailConfirm} required />
                                    </div>
                                    <button className="btn btn-danger bg-gradient d-flex justify-content-center align-self-center" style={{width:'100%' , margin:'auto'}}
                                        disabled={!formData.name || !formData.phone || !formData.email || formData.email !== formData.emailConfirm || cartList.length == 0}>
                                        Buy
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default FormBuyer