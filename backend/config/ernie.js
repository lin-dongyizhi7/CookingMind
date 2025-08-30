const axios = require('axios');
const crypto = require('crypto');

class ErnieAPI {
  constructor() {
    this.apiKey = process.env.ERNIE_API_KEY;
    this.secretKey = process.env.ERNIE_SECRET_KEY;
    this.accessToken = process.env.ERNIE_ACCESS_TOKEN;
    this.baseURL = 'https://aip.baidubce.com';
  }

  // 获取访问令牌
  async getAccessToken() {
    try {
      const response = await axios.get(
        `${this.baseURL}/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.secretKey}`
      );
      return response.data.access_token;
    } catch (error) {
      console.error('获取文心API访问令牌失败:', error.message);
      throw error;
    }
  }

  // 图像识别 - 食材识别
  async recognizeIngredients(imageBase64) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/rest/2.0/ai_custom/v1/wenxinworkshop/plugin/eb-instant/eb-instant`,
        {
          image: imageBase64,
          prompt: "请识别这张图片中的食材，返回JSON格式：{ingredients: [{name: '食材名称', quantity: '数量', freshness: '新鲜程度', category: '分类'}]}"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('食材识别失败:', error.message);
      throw error;
    }
  }

  // 文本生成 - 食谱生成
  async generateRecipe(ingredients, requirements) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/rest/2.0/ai_custom/v1/wenxinworkshop/chat/completions`,
        {
          messages: [
            {
              role: "user",
              content: `基于以下食材：${ingredients.join(', ')}，需求：${requirements}，请生成一份详细的食谱，包括食材清单、步骤、营养信息等。`
            }
          ],
          temperature: 0.7,
          top_p: 0.8
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('食谱生成失败:', error.message);
      throw error;
    }
  }

  // 视频生成 - 烹饪指导
  async generateCookingVideo(step, ingredients) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/rest/2.0/ai_custom/v1/wenxinworkshop/text2video/sd_xl`,
        {
          prompt: `烹饪步骤：${step}，使用食材：${ingredients.join(', ')}，生成一个清晰的烹饪指导视频`,
          width: 1024,
          height: 576,
          duration: 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('烹饪视频生成失败:', error.message);
      throw error;
    }
  }

  // 语音识别
  async speechToText(audioBase64) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/rest/2.0/ai_custom/v1/wenxinworkshop/asr/trans`,
        {
          audio: audioBase64,
          format: 'pcm',
          rate: 16000,
          channel: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('语音识别失败:', error.message);
      throw error;
    }
  }
}

module.exports = new ErnieAPI();
