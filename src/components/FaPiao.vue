<template>
<el-container>
  <el-main class="main">
    <h1>通讯发票截图生成器</h1>
    <el-alert
      type="warning"
      show-icon>
      该工具为个人对服务端图像合成技术的练习研究，不对发票的真实性合法性负责 <a href="https://etax.guangdong.chinatax.gov.cn/xxmh/html/index_origin.html?gopage=true&m1=gzcx#none" target="_blank">发票查验地址</a>
    </el-alert>
    <br>
    <el-alert
      type="info"
      :closable="false"
      show-icon>
      <ol>
        <li>填写号码段，点击号码栏右侧 <span class="el-icon-circle-plus"></span> 号，可输入多个号码段</li>
        <li>勾选“直接生成word文档”，就会下载一份截好图的word文档，否则会下载一个图片压缩包</li>
        <li>点击开始按钮，截图生成后提供附件下载，搞定</li>
      </ol>

    </el-alert>
    <el-form action="/fapiao" target="_blank" class="form" label-position="top" ref="form" label-width="80px">
      <el-form-item label="代码">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="号码">
        <span class="tips">号码为8位纯数字，一次最多支持100个号码</span>
        <div class="range-item" v-for="(number, index) in form.numbers" :key="number.id">
          <el-input class="range-input" v-model="number.min"></el-input>
          <span class="connector">-</span>
          <el-input class="range-input" v-model="number.max"></el-input>
          <i @click="addNumberItem" v-if="index === 0" class="add-number-item el-icon-circle-plus"></i>
          <i @click="removeNumberItem(index)" v-else class="add-number-item el-icon-remove"></i>
        </div>
      </el-form-item>
      <el-form-item label="识别号">
        <el-input v-model="form.sign"></el-input>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="form.money"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.genWord">
          直接生成Word文档
        </el-checkbox>
      </el-form-item>
      <el-form-item class="button-bar">
        <input type="hidden" class="hide" :value="value" name="value" ref="value">
        <button type="submit" class="hide" ref="submit">submit</button>
        <el-button class="submit" @click="submit" type="primary">开始</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</el-container>
</template>

<script>
export default {
  name: 'Fapiao',
  data () {
    return {
      ready: false,
      value: "",
      numbers: [],
      images: [],
      form: {
        code: '144011690802',
        numbers: [
          {
            min: 0,
            max: 0
          }
        ],
        sign: '91440101618652334F',
        money: 50,
        path: '',
        range: [],
        genWord: true
      },
      win: null
    }
  },
  mounted () {},
  methods: {
    addNumberItem () {
      this.form.numbers.push({
        min: 0,
        max: 0
      })
    },
    removeNumberItem (index) {
      this.form.numbers.splice(index, 1)
    },
    validNumbers () {
      for (let numbers of this.form.numbers) {
        if (!/^\d{8}$/.test(numbers.min) || !/^\d{8}$/.test(numbers.max)) {
          return Promise.reject(new Error('发票号码只能输入8位数字'))
        }
        if (numbers.max < numbers.min) {
          let temp = numbers.max
          numbers.max = numbers.min
          numbers.min = temp
        }
        if (numbers.max - numbers.min > 100) {
          return Promise.reject(new Error('一次最多只能生成100个号码的截图'))
        }
      }

      return Promise.resolve()
    },
    submit () {
      this.validNumbers()
        .then(() => {
          this.value = JSON.stringify(this.form)
          this.$nextTick(() => {
            this.$refs.submit.click()
          })
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    }
  }
}
</script>

<style lang="postcss">
body {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  padding: 0;
  margin: 0;
}

.left {
  border-right: 1px #ccc solid;
  background: #eee;
  min-height: 100vh;
}
.main {
  max-width: 550px;
  margin: 0 auto;
}

.form {
  padding: 10px;
}

.form .el-form-item {
  margin-bottom: 5px;
}

.form.el-form--label-top .el-form-item__label{
  padding: 0;
}
.tips {
  color: #999;
}

.connector {
  padding: 0 3px;
}
.range-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;

  &:last-child {
    padding-top: 0;
  }
}
.add-number-item {
  color: #999;
  margin-left: 5px;
  cursor: pointer;
}
.path {
  text-overflow: ellipsis;
  max-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
.button-bar {
  padding-top: 10px;
}

.submit {
  width: 100%;
}
.hide {
  display: none;
}
</style>
