(function () {
  var rtn = {
      userid: '',
      appid: '',
      groupId: 0,
      enterpriseId: '',
      enterpriseName:'',
      childEnterpriseId: '',
      childName: '',
      systems: 1,
      getNeededKey: function () {
          var neededObj = {};
          var hasNeededKey = false;
          if (rtn.enterpriseId == '' || rtn.childEnterpriseId == '') {
              rtn['enterpriseId'] = neededObj['enterpriseId'] = '';
              rtn['childEnterpriseId'] = neededObj['childEnterpriseId'] = '';
              hasNeededKey = true;
          }
          if (hasNeededKey) {
              return neededObj;
          }
          return null;
      },
  };
  var enterpriseIdAccessor = {
      url: 'https://open.t.nxin.com/api/nxin.usercenter.enterprise.get/2.0',
      getEnterpriseId: function (callback) {},
  };

  function checkNullOrEmpty(value, isAlert) {
      if (value == null) {
          if (isAlert) console.error('参数未赋值,请检查您的参数');
          return false;
      }
      if (value === '') {
          if (isAlert) console.error('参数有误，请检查您的参数');
          return false;
      }
      if (value == undefined) {
          if (isAlert) console.error('参数未定义，请检查您的参数');
          return false;
      }

      return true;
  }

  function retriveUrl() {
      var query_str_split_expr = /&{1,2}/;
      var url_expr = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      var local_expr = /(http|ftp|https):\/\/localhost.*/;
      var url = window.location.href;
      if (!url_expr.test(url) && !local_expr.test(url)) {
          throw '不合法的url';
      }
      var url_segs = url.split('?');
      if (url_segs.length > 1) {
          var query_str = url_segs[1];
          if (query_str && query_str.trim() != '') {
              query_str_arr = query_str.split(query_str_split_expr);
              for (var index = 0; index < query_str_arr.length; index++) {
                  var query_key_value = query_str_arr[index].split('=');
                  if (query_key_value.length >= 2) {
                      var query_key = query_key_value[0];
                      var query_value = query_key_value[1];
                      if (rtn.hasOwnProperty(query_key)) {
                          rtn[query_key] = query_value;
                      }
                  }
              }
          }
      }
      if ((url.indexOf('localhost') > 0 && rtn.appid === '') || url.indexOf('arcqlw.t.nxin.com') > 0) {
          rtn.appid = 0;
          rtn.enterpriseId = 0;
          rtn.childEnterpriseId = 0;
          rtn.groupId = 0;
      }
      return rtn;
  }
  function retriveStore() {
      if (!window.parent || !window.parent.$getSessionStorage) {
          return;
      }
      var neededKey = rtn.getNeededKey();
      if (neededKey != null) {
          for (var prop in neededKey) {
              rtn[prop] = window.parent.$getSessionStorage(prop);
          }
      }
  }
  function retriveGateway() {
      var neededKey = rtn.getNeededKey();
      if (neededKey != null) {
          enterpriseIdAccessor.getEnterpriseId(function (enterpriseId) {
              rtn['enterpriseId'] = enterpriseId;
          });
      }
  }

  function retryGetDataWithStore(key) {
      if (!window.parent || !window.parent.$getSessionStorage) {
          return null;
      }
      return window.parent.$getSessionStorage(key);
  }
  /**
   * set cookie
   * @param {cookie key name} cname
   * @param {cookie value} cvalue
   * @param {* cookie expires date} exdays
   */
  function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = 'expires=' + d.toGMTString();
      document.cookie = cname + '=' + cvalue + '; ' + expires;
  }
  /**
   * get cookie
   * @param {cookie name} cname
   */
  function getCookie(cname) {
      var name = cname + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return '';
  }

  try {
      var r = retriveUrl();
      //appid只从地址栏拿，如果没拿到直接异常
      if (!checkNullOrEmpty(r.appid, true)) return;
      if (!checkNullOrEmpty(r.groupId, true)) rtn.groupId = 0;
      if (!checkNullOrEmpty(r.enterpriseId, false)) {
          //检查enterpriseId参数 地址栏没拿到 在去缓冲拿，缓冲没有就 alert
          //缓冲拿
          var eId = retryGetDataWithStore('enterpriseId');
          if (checkNullOrEmpty(eId, true)) {
              r.enterpriseId = eId;
          }
          //return;//缓冲没拿到
      }
      if (!checkNullOrEmpty(r.childEnterpriseId, false)) {
          var ceId = retryGetDataWithStore('childEnterpriseId');
          if (!checkNullOrEmpty(ceId, false)) {
              r.childEnterpriseId = 0;
          } else {
              r.childEnterpriseId = ceId;
          }
      }
      var cName = retryGetDataWithStore('childEnterpriseName');
      if (!checkNullOrEmpty(cName, false)) {
          rtn.childName = '';
      } else {
          rtn.childName = cName;
      }
      // retriveStore();
      // retriveGateway();
      if (this.parent.$store) {
          rtn.userid = this.parent.$store.state.app.userInfo.idStr;
          rtn.enterpriseName = this.parent.$store.state.app.enterprise.default.Name;
          let ChildEnterpriseArr = this.parent.$store.state.app.enterprise.default.ChildEnterprise;
          let item = ChildEnterpriseArr.filter((item) => {
              return item.IsDefault;
          });
          if (item && item.length) {
              rtn.systems = item[0].Systems;
          }
          // rtn.systems = this.parent.$store.state.app.enterprise.default.Systems;
      } else {
          rtn.userid = parseInt(Math.random() * (99999 - 10000 + 1) + 10000, 10);
      }
      window.userInfo = rtn;
  } catch (ex) {
      console.error(ex);
  }
})();
