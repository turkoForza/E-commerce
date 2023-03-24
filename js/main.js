//! api actions
const categoryUrl = "https://api.escuelajs.co/api/v1/categories";
const productsUrl = "https://api.escuelajs.co/api/v1/products";

//import category data and create category cards
fetch (categoryUrl)
.then((response)=>response.json())
.then((data)=>{
    for(let i = 0; i<5; i++) {
        Card.createCard(data[i]);
    }
})
.catch((error)=>console.log(error))

//import product data and create category cards
fetch (productsUrl)
.then((response)=>response.json())
.then((data)=>{
    for(let i = 0; i<25; i++) {
        Card.createCard(data[i]);
    }

    document.querySelectorAll(".product-card").forEach((productCard)=>{
        productCard.addEventListener("click",Cart.addToCart);
    })
})
.catch((error)=>console.log(error))

//! producer of product and category
class Card {

    static createCard = (data) => {
        if (data.hasOwnProperty("category")){
            let div = document.createElement("div");
            div.className = "product-card";
            div.innerHTML = `
        
                <img src="${data.images[0]}">
                <h5 class="title">${data.title}</h5>
                <div class="product-info">
                    <span class="price">
                    ${(data.price*0.1).toFixed(1)}$
                    </span>
                    <button class="add-to-cart">Add to cart</button>
                </div>
            
            `;
            document.getElementById("pro-box").appendChild(div);
 
        }else{
            let div = document.createElement("div");
            div.className = "category-card";
            div.innerHTML = `        
                <img src="${data.image}">
                <div class="layer">${data.name}</div>
            `;
            document.getElementById("cat-box").appendChild(div);
        }
    }
    
}



//! shopping cart actions
class Cart{

    static shoppingCart = document.querySelector(".shopping-cart");

    static cartItemBox = document.getElementById("cart-item-box");

    static clearBtn = document.getElementById("clear");

    static allPrices = [];

    static showHideCart = (e)=>{
        if(e.target.className == "fa-solid fa-angles-left" || e.target.className == "fa-solid fa-angles-right" || e.target.className == "fa-solid fa-cart-shopping"){
            this.shoppingCart.classList.toggle("show-cart");
            if(this.shoppingCart.classList.contains("show-cart")){
                document.querySelector(".fa-angles-left").classList.replace("fa-angles-left", "fa-angles-right");
            }else{
                document.querySelector(".fa-angles-right").classList.replace("fa-angles-right", "fa-angles-left");
            };
        }
    };

    static addToCart = (e)=>{
        
        if(e.target.className == "add-to-cart"){
            let div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `<img class="item-img" src="${e.target.parentElement.parentElement.firstElementChild.getAttribute("src")}">
            <span class="item-title">${e.target.parentElement.previousElementSibling.innerText}
            </span>
            <span class="item-price">${e.target.previousElementSibling.innerText}</span>
            <input class="item-count" type="number" value="1" onkeydown="return false" onchange="${this.calculateTotalAmount(e)}">`

            this.cartItemBox.appendChild(div);

            this.calculateTotalAmount(e);

            //fix item counter
            this.fixItemCounter(e);

        };
        
    };

    static deleteFromCart = (e)=>{
        if(e.target.className == "item-count"){
            if(e.target.value == 0){
                e.target.parentElement.remove();

                //fix item counter
                this.fixItemCounter(e);
            }
        }
    };

    static clearAllItemsFromCart = ()=>{
            this.cartItemBox.innerHTML = "";

            //reset total
            document.getElementById("total-amount").value = 0;

            //reset item counter
            this.fixItemCounter();
    };

    static calculateTotalAmount = () => {
        let cartItems = document.querySelectorAll(".cart-item");
        let totalPrice = 0;
    
        cartItems.forEach((item) => {
            let itemPrice = parseFloat(item.querySelector(".item-price").innerText);
            let itemCount = parseInt(item.querySelector(".item-count").value);
            totalPrice += itemPrice * itemCount;
        });
    
        document.getElementById("total-amount").value = totalPrice.toFixed(2);
    }

    static fixItemCounter = ()=>{
        document.getElementById("items-count").innerText = this.cartItemBox.children.length;
    }

};


Cart.shoppingCart.addEventListener("click", Cart.showHideCart);

Cart.cartItemBox.addEventListener("click",Cart.deleteFromCart);

Cart.cartItemBox.addEventListener("click",Cart.calculateTotalAmount)

Cart.clearBtn.addEventListener("click", Cart.clearAllItemsFromCart);
