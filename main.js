var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        brand: 'Vue MASTERY',
        selectedVariant: 0,
        onSale: true,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: './assets/green-socks.jpeg',
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: './assets/blue-socks.jpeg',
                variantQuantity: 0
            }
        ],
        sizes: ["small", "medium", "large"],
        cart: 0
    },
    methods: {
        addToCart: function () {
            this.cart += 1
        },
        updateProduct: function (index) {
            this.selectedVariant = index
            console.log(index)
        },
        removeFromCart: function () {
            this.cart -= 1
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        }
    }   
})