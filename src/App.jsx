import { useEffect, useState } from 'react'
import Header from "./components/Header"
import Notebook from "./components/Notebook"
import { db } from './data/db'

  
function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorage ?  JSON.parse(localStorageCart) : []
  }


  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)


  const MIN_ITEMS = 1
  const MAX_ITEMS = 5

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
  
  function addToCart(item) {
    const itemExists = cart.findIndex((notebook) => notebook.id === item.id);
    if (itemExists >= 0) {// Existe en el carrito
        const updatedCart = [...cart];
        if (updatedCart[itemExists].quantity < MAX_ITEMS) {
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        } else {
            alert(`No puedes agregar más de ${MAX_ITEMS} unidades de este producto.`);
        }
    } else {
        // Producto nuevo: lo agregamos con cantidad inicial de 1
        setCart([...cart, { ...item, quantity: 1 }]);
    }
   
}


  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(notebook => notebook.id !== id))
  }


  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
        if (item.id === id) {
            return {
                ...item,
                quantity: item.quantity - 1
            };
        }
        return item;
    }).filter(item => item.quantity > 0); // Filtra productos con cantidad 0

    setCart(updatedCart);
}



  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }


  function clearCart() {
      setCart([])
  }


  return (
    <>
    <Header
    cart={cart}
    removeFromCart={removeFromCart}
    increaseQuantity={increaseQuantity}
    decreaseQuantity={decreaseQuantity}
    clearCart={clearCart}
    />

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestro Stock</h2>

        <div className="row mt-5">
          {data.map((notebook) => (
            <Notebook
            key={notebook.id}
            notebook={notebook}
            setCart={setCart}
            addToCart={addToCart}
            />
          ))}
  

        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">Zona Gamer - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
