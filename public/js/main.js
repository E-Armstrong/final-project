var mainVm = new Vue({
    el: '#app',
    data: {
        currentSites: [],
        currentUsers: [],
        seeSites: true,
    },
    methods: {
        getFreshSites: function(event){
            $.post("/currentsites", function(data) {
                console.log("the getFreshSites...data: ", data)
                
                mainVm.currentSites = data
            })
        },
        getFreshUsers: function(event){
            $.post("/currentusers", function(data) {
                console.log("the getFreshUsers...data: ", data)
                
                mainVm.currentUsers = data
            })
        },
    },
    created(){
        this.getFreshSites();
        this.getFreshUsers();
     },
})