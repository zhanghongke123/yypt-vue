<template>
    <single-page :pageConfig="pageConfig">
        <!-- <template #shCompanyName_default="data" >
             <span>{{data.column}}</span>
        </template> -->
    </single-page>
</template>

<script>
import SinglePage from '@/components/SinglePage'
export default {
    components:{
        SinglePage
    },
    created(){
        this.getConfig()
    },
    data () {
        return {
             pageConfig:{}
        }
    },
    methods:{
        getConfig(){
            this.pageConfig = require('./config.json')
        }
    }
    
}
</script>

<style>

</style>