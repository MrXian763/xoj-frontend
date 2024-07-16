<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入题目标题" />
      </a-form-item>
      <a-form-item
        field="radio"
        label="难度"
        :rules="[{ match: /one/, message: '必须选择一个难度' }]"
      >
        <a-radio-group v-model="form.difficulty">
          <a-radio value="1">简单</a-radio>
          <a-radio value="2">中等</a-radio>
          <a-radio value="3">困难</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <CodeEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题限制" :content-flex="false" :merge-props="false">
        <a-form-item field="judgeConfig.timeLimit" label="时间限制">
          <a-input-number
            v-model="form.judgeConfig.timeLimit"
            :style="{ width: '320px' }"
            placeholder="请输入时间限制"
            size="large"
            min="0"
            class="input-demo"
          />
        </a-form-item>

        <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
          <a-input-number
            v-model="form.judgeConfig.memoryLimit"
            :style="{ width: '320px' }"
            placeholder="请输入内存限制"
            size="large"
            min="0"
            class="input-demo"
          />
        </a-form-item>

        <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
          <a-input-number
            v-model="form.judgeConfig.stackLimit"
            :style="{ width: '320px' }"
            placeholder="请输入堆栈限制"
            size="large"
            min="0"
            class="input-demo"
          />
        </a-form-item>
      </a-form-item>

      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-form-item
            :field="`form.judgeCase[${index}].input`"
            :label="`输入用例-${index}`"
            :key="index"
          >
            <a-input
              v-model="judgeCaseItem.input"
              placeholder="请输入测试输入用例"
            />
          </a-form-item>
          <a-form-item
            :field="`form.judgeCase[${index}].output`"
            :label="`输出用例-${index}`"
            :key="index"
          >
            <a-input
              v-model="judgeCaseItem.output"
              placeholder="请输入测试输出用例"
            />
          </a-form-item>
          <a-button @click="handleDelete(index)" status="danger">删除</a-button>
        </a-form-item>

        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px"></div>

      <a-form-item>
        <a-button
          html-type="submit"
          type="primary"
          @click="doSubmit"
          style="min-width: 200px"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

const form = ref({
  title: "",
  content: "",
  difficulty: 0,
  tags: [],
  answer: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
});

/**
 * 新增测试用例
 */
const handleAdd = () => {
  if (form.value.judgeCase) {
    form.value.judgeCase.push({
      output: "",
      input: "",
    });
  }
};

/**
 * 删除测试用例
 * @param index 要删除的索引
 */
const handleDelete = (index: number) => {
  if (form.value.judgeCase) {
    form.value.judgeCase.splice(index, 1);
  }
};

/**
 * 表单提交
 */
const doSubmit = async () => {
  const res = await QuestionControllerService.addQuestionUsingPost(
    form.value as any
  );
  if (res.code === 0) {
    message.success("创建成功");
  } else {
    message.error("创建失败" + res.message);
  }
};

/**
 * 修改内容
 * @param v
 */
const onContentChange = (v: string) => {
  form.value.content = v;
};

/**
 * 修改答案
 * @param v
 */
const onAnswerChange = (v: string) => {
  form.value.answer = v;
};
</script>

<style scoped>
#addQuestionView {
}
</style>
