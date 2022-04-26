<template>
  <div class="yypt-button">
    <el-button  size="small"  type="primary" @click="click"><svg-icon :iconClass= 'icon' v-if="icon != '' && icon != undefined "></svg-icon>{{buttonName}}</el-button>
  </div>
</template>

<script>

  export default {
    name:'yypt-button',
    props:{
        permission:{
            type:String,
            required:true
        }
    },
    data () {
      return {
          buttonName:'',
          icon:'',
          buttons:this.$route.meta.buttons

      };
    },
    methods:{
       click(){
         this.$emit('click')
       }
    },
    mounted() {
      let button = {}
      if(this.buttons == undefined || this.buttons == null){
         this.buttons = []
      }
      for (let index = 0; index < this.buttons.length; index++) {
        const element = this.buttons[index]
        if(element.permission == this.permission){
             button = element
             break
        }
      }

      this.icon = button.icon
      this.buttonName = button.name
      
    },

  }

</script>
<style lang='scss' scoped>
button{
  padding: 4px;
  font-size: 14px;
}

svg.svg-icon{
  width: 18px;
  height: 18px;
  margin-right: 4px;
}

.yypt-button+.yypt-button {
    margin-left: 10px;
    display: block;
}

.yypt-button button{
  float: left;
  margin-left: 10px;
  margin-right: 5px;
}


</style>