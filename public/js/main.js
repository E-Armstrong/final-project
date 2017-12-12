var mainVm = new Vue({
    el: '#app',
    data: {
        currentSites: [],
    },
    methods: {
        getFreshData: function(event){
            $.post("/currentinfo", function(data) {
                console.log("the getFreshData...data: ", data)
                
                
                
                
                mainVm.currentSites = data
            })
        },
    },
    created(){
        this.getFreshData()
     },
})