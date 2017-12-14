let Developer = new Vue({
    el: '#app',
    data: {
        user: {
            name: '',
            password: '',
        },
        
    },
    methods: {
        submitData: function(evt) {
            evt.preventDefault();
            
            console.log(this.user)
            $.post('/log-in-user', {user: this.user}, function(datafromserver){
                console.log("Post to /log-in-user a success!")
            })
        },
    }
});