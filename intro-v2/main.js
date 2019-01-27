var eventBus = new Vue() 

// Product tabs
Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab">
                {{ tab }} 
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>Name: {{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>Review: {{ review.review }}</p>
                        <p>Recommend: {{ review.recommend }}</p>
                    </li>
                </ul>
            </div>
    
            <product-review
                v-show="selectedTab === 'Make a Review'">
            </product-review>
        </div>
    `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: "Reviews"
        };
    }
});

// Product Review Component
Vue.component("product-review", {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b> Please correct the following errors. </b>
                <ul>
                    <li v-for="error in errors">{{ error }} </li>
                </ul>
            </p>
            <p>
                <label for="name">Name: </label>
                <input id="name" v-model="name">
            </p>
            <p>
                <label for="review">Review: </label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating: </label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                <label for="recommend">Would you recommend this product?</label>
                <input type="radio" v-model="recommend" value="yes"> Yes
                <input type="radio" v-model="recommend" value="no"> No 
                <input type="radio" v-model="recommend" value="maybe"> Maybe
            </p>
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        };
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                };
                eventBus.$emit("review-submitted", productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                this.errors = [];
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (!this.recommend) this.errors.push("Recommend required.");
            }
        }
    }
});

// Product Details Component
Vue.component("product-details", {
    props: {
        details: {
            type: String,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `
});

// Product Component
Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <p v-if="inStock">In Stock</p>
            <p v-else-if="almostOut">Almost Out!</p>
            <p v-else>Out of Stock</p>     
            <p>Shipping: {{ shipping }}</p>              
            <p>
                <span v-if="onSale"> {{ saleProduct }} On Sale!</span>
                <span v-else>Definitely <b>NOT</b> on sale..</span>
            </p>
            <a v-bind:href="url">more info</a>

            <product-details :details="details"></product-details>                    

            <div v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>
            <p>Sizes</p>
            <ul>
                <li v-for="size in sizes">{{ size }} </li> 
            </ul>
        </div>

        <div>
            <button v-on:click="addToCart"
                :disabled="outOfStock"
                :class="{ disabledButton: outOfStock }">
                Add to Cart
            </button>
            <button v-on:click="removeFromCart">Remove from Cart</button>                
        </div>   
        
        <product-tabs :reviews="reviews"></product-tabs>        
    </div>
    `,
    data() {
        return {
            brand: "Nike",
            product: "Socks",
            description: "100$",
            selectedVariant: 0,
            url: "https://www.google.com",
            details: ["80% cotton", "20% poly", "Woooot!"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/green-socks.jpeg",
                    variantQuantity: 10,
                    variantOnSale: true
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/blue-socks.jpeg",
                    variantQuantity: 10,
                    variantOnSale: true
                }
            ],
            sizes: ["XS", "S", "M", "L", "XL"],
            reviews: []
        };
    },
    methods: {
        addToCart: function() {
            this.$emit(
                "add-to-cart",
                this.variants[this.selectedVariant].variantId
            );
        },
        updateProduct: function(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeFromCart: function() {
            this.$emit(
                "remove-from-cart",
                this.variants[this.selectedVariant].variantId
            );
        }
    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 10;
        },
        almostOut() {
            var inventory = this.variants[this.selectedVariant].variantQuantity;
            return inventory <= 10 && inventory > 0;
        },
        outOfStock() {
            var inventory = this.variants[this.selectedVariant].variantQuantity;
            return inventory <= 0;
        },
        onSale() {
            return this.variants[this.selectedVariant].variantOnSale;
        },
        saleProduct() {
            var color = this.variants[this.selectedVariant].variantColor;
            return this.brand + " " + color + " " + this.product;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return "$2.99";
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    }
});

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        // this cart object is causing problems with methods/computed properties
        cart: {},
        update: false
    },
    methods: {
        updateCart(id) {
            // https://stackoverflow.com/a/1098955/2179970
            if (id in this.cart) {
                this.cart[id] += 1;
            } else {
                this.cart[id] = 1;
            }
            // If you comment this line, the computed methods won't work
            // why do i need this??
            this.update = true;
        },
        removeFromCart(id) {
            if (id in this.cart) {
                this.cart[id] -= 1;
            } else {
                console.log(
                    "ERROR: user tried to remove item that is not there!"
                );
            }
            // If you comment this line, the computed methods won't work
            // why do i need this??
            this.update = true;
        }
    },
    computed: {
        numCartItems() {
            // these two lines are NOT needed..
            // but if you remove them, this property will NOT update
            this.update = false;
            var up = this.update;

            var sum = 0;
            var dict = this.cart;
            for (var key in dict) {
                sum += dict[key];
            }
            return sum;
        },
        cartItems() {
            // these two lines are NOT needed..
            // but if you remove them, this property will NOT update
            this.update = false;
            var up = this.update;

            var dict = this.cart;
            var cartArray = [];
            for (var key in dict) {
                cartArray.push(key + ": " + dict[key]);
            }
            return cartArray;
        }
    }
});

Vue.config.devtools = true;
