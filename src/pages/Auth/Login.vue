<template>
    <div class="container-fluid ps-md-0">
        <div class="row g-0">
            <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
            <div class="col-md-8 col-lg-6">
            <div class="login d-flex align-items-center py-5">
                <div class="container">
                <div class="row">
                    <div class="col-md-9 col-lg-8 mx-auto">
                    <h3 class="login-heading mb-4">Welcome back!</h3>

                    <!-- Sign In Form -->
                    <form v-on:keyup.enter="handleSubmit">
                        <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="form.email">
                        <label for="floatingInput">Email address</label>
                        </div>
                        <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="form.password">
                        <label for="floatingPassword">Password</label>
                        </div>

                        <!-- <div class="form-check mb-3">
                        <input class="bg-secondary form-check-input" type="checkbox" value="" id="rememberPasswordCheck">
                        <label class="form-check-label" for="rememberPasswordCheck">
                            Remember password
                        </label>
                        </div> -->

                        <div class="d-grid">
                        <button class="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" v-on:click="handleSubmit">Sign in</button>
                        <div class="text-center">
                            <a class="small" href="#">Forgot password?</a>
                        </div>
                        </div>

                    </form>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'Login',
        data: () => ({
            form: {
                email: '',
                password: ''
            }
        }),
        methods: {
            handleSubmit(e){
                e.preventDefault()
                this.$store.dispatch("login", this.form)
                .then(res => this.$router.push('/'))
                .catch(err => {
                        this.error = true
                        console.log(err)
                })

            }
        }
    }
</script>
<style scoped>
    .login {
        min-height: 100vh;
    }

    .bg-image {
        background-image: url('https://source.unsplash.com/WEQbe2jBg40/600x1200');
        background-size: cover;
        background-position: center;
    }

    .login-heading {
        font-weight: 300;
    }

    .btn-login {
        font-size: 0.9rem;
        letter-spacing: 0.05rem;
        padding: 0.75rem 1rem;
    }

</style>

