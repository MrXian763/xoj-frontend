<!-- 题目详情页 -->
<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.id + '.' + question.title">
              <template #extra>
                <a-tag
                  :color="
                    question.difficulty === 1
                      ? 'green'
                      : question.difficulty === 2
                      ? 'orange'
                      : 'red'
                  "
                >
                  {{ difficultyText }}
                </a-tag>
              </template>
              <MdViewer :value="question.content || ''" />
              <a-descriptions
                bordered
                column="1"
                table-layout="fixed"
                title="运行限制"
              >
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig?.memoryLimit }}
                </a-descriptions-item>
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig?.timeLimit }}
                </a-descriptions-item>
              </a-descriptions>

              <a-divider />
              <a-card-meta>
                <template #description>
                  {{
                    question ? "标签：" + question.tags.join(",") : "暂无标签"
                  }}
                  <br />
                  <br />
                  {{
                    "总通过次数：" +
                    question.acceptedNum +
                    " | " +
                    "总提交次数：" +
                    question.subMitNum +
                    " | " +
                    "通过率：" +
                    passRate
                  }}
                </template>
              </a-card-meta>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" :title="solutionDetailsCountTitle">
            <solution-details-card :questionId="question?.id" />
          </a-tab-pane>
          <a-tab-pane key="commitRecord" disabled>
            <template #title>提交记录</template>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form layout="inline">
          <a-form-item label="编程语言">
            <a-select
              v-model="form.language"
              :style="{ width: '160px' }"
              :trigger-props="{ autoFitPopupMinWidth: true }"
              placeholder="编程语言"
            >
              <a-option>java</a-option>
              <!--              <a-option>c</a-option>-->
              <!--              <a-option>cpp</a-option>-->
              <!--              <a-option>python</a-option>-->
              <!--              <a-option>go</a-option>-->
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :handle-change="onChangeCode"
          :language="form.language"
          :value="form.code"
        />
        <a-divider size="0" />
        <div style="display: flex; justify-content: flex-end">
          <a-button :disabled="bandClick" type="primary" @click="onSubmitCode"
            >提交代码
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, withDefaults, defineProps, computed } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import myAxios from "@/plugins/axios";
import SolutionDetailsCard from "@/components/SolutionDetailsCard.vue";

const question = ref<QuestionVO>();

const bandClick = ref(false);

const solutionDetailsCount = ref(0);
let solutionDetailsCountTitle = ref(
  "题解（" + solutionDetailsCount.value + "）"
);

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

onMounted(async () => {
  await loadData();
  await getSolutionDetails(); // 加载题解数量
});

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载题目失败" + res.message);
  }
};

/**
 * 答案表单
 */
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

/**
 * 修改用户填写的答案代码
 * @param v 代码
 */
const onChangeCode = (v: string) => {
  form.value.code = v;
};

/**
 * 提交答案
 */
const onSubmitCode = async () => {
  bandClick.value = true;
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
  setTimeout(() => {
    bandClick.value = false; // 操作完成后重新启用按钮
  }, 3000); // 3秒后
};

/**
 * 题目通过率
 */
const passRate = computed(() => {
  const acceptedNum = question.value?.acceptedNum as number;
  const submitNum = question.value?.subMitNum as number;
  if (submitNum === 0) {
    return "0%";
  }
  const rate = (acceptedNum / submitNum) * 100;
  return `通过率：${rate.toFixed(2)}%`;
});

const getSolutionDetails = async () => {
  const res = await myAxios.get("/question/solution-details/count", {
    params: {
      problemId: props.id,
    },
  });
  if (res.status === 200) {
    solutionDetailsCount.value = res.data.data;
    solutionDetailsCountTitle.value =
      "题解（" + solutionDetailsCount.value + "）";
  } else {
    message.error("加载题解数量失败" + res.message);
  }
};

/**
 * 题目难度信息
 */
const difficultyText = computed(() => {
  const difficulty = question.value?.difficulty as number;
  switch (difficulty) {
    case 1:
      return "简单";
    case 2:
      return "中等";
    default:
      return "困难";
  }
});
</script>

<style scoped>
#viewQuestionView {
  margin: 0 auto;
}
</style>
