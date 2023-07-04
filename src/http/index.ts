// 1.引入axios
import axios, { type AxiosInstance } from "axios";

// 创建一个实例
class AxiosUtil {
  private http: AxiosInstance;
  //constructor构造函数  如果class被new了一个新的实例,会自动调用构造函数来做准备函数
  constructor() {
    this.http = axios.create({
      timeout: 10000, //请求超时时间,请求时间超过则提醒请求超时
    });

    // 拦截器在实例一创建的时候就要调用
    this.addInterceptors();
  }

  // axios拦截器
  private addInterceptors() {
    // 请求拦截
    this.http.interceptors.request.use(
      (config: any) => {
        // 可以做一些操作,例如拦截添加token
        return config;
      },
      (err: any) => {
        return Promise.reject(err);
      }
    );

    //   响应拦截器
    this.http.interceptors.response.use(
      (res: any) => {
        // 处理请求回来的东西
        return Promise.resolve(res);
      },
      (err: any) => {
        return Promise.reject(err);
      }
    );
  }

  //  配置必传参数的方法
  public request(obj: any) {
    return this.http(obj);
  }
}

//  如果class被new了一个新的实例,会自动调用构造函数来做准备函数
const $http = new AxiosUtil();
export default $http;