<template>
  <div>
      <YyptQuery :querycols="querycols" @query="query"></YyptQuery>

      <el-table :data="datalist"         
        style="width: 100%;"
        row-key="logId"
        height="70vh"
        border
        stripe
        highlight-current-row
        v-loading="listLoading">
    
      <el-table-column prop="logId" label="ID" width="80" align="center">        
      </el-table-column>

      <el-table-column prop="username" label="账号" width="100" align="center"> 
      </el-table-column>
      
      <el-table-column prop="operation" label="描述信息" width="150" align="center" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column prop="method" label="方法" width="180" align="center" :show-overflow-tooltip="true">
      </el-table-column>


      <el-table-column prop="time" label="耗时(毫秒)" width="100" align="center" :show-overflow-tooltip="true">
      </el-table-column>


      <el-table-column prop="params" label="参数" width="180" align="center" :show-overflow-tooltip="true">
      </el-table-column>

        <el-table-column prop="ip" label="调用ip" width="200" align="center">
      </el-table-column>

        <el-table-column prop="location" label="所在地" width="180" align="center">
      </el-table-column>

      <el-table-column prop="createDate" label="调用日期" width="180" align="center">
      </el-table-column>

    </el-table>

    <el-pagination background :page-sizes="pagesizes" :current-page="currentPage" @size-change="handleSizeChange" :page-size="pageSize"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
  </div>
</template>

<script>
import YyptQuery from '@/components/YyptQuery'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          querycols:[
            {
                prop:"username",
                label:"用户名",
                type:"input"
            },
            {
                prop:"ip",
                label:"ip",
                type:"input"
            },
             {
                prop:"operation",
                label:"接口描述",
                type:"input"
            },
          ],
          datalist:[],
          currentPage: 0,
          total: 0,
          pagesizes:[20, 40, 100],
          pageSize:20,
          queryconditions:{},
          sortField:''
      };
    },
    created(){
      this.currentPage = 0
      this.fetchData()
    },
    components: {
        YyptQuery
    },

    methods: {
      handleSizeChange(val){
        this.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.fetchData()
      },
      query(res){
          this.queryconditions = res
          this.fetchData()
      },
      
      fetchData(){
        this.listLoading = true
        const req = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
          querylist: this.queryconditions
        }
        this.$api.post('syslog/list',req).then(resp =>{
            this.datalist = resp.records
            this.total = resp.total
            this.listLoading = false
        })

      }
    },

    watch: {}

  }

</script>
<style lang='' scoped>

</style>