Angular-xeditable说明文档-Cpy
==========================================
[Angular-xeditable 英文网原文连接](http://vitalets.github.io/angular-xeditable)

[TOC]

## Overview(概述)
*   Angular-xeditable 是一种允许你创建可编辑元素的Angular指令。
这种技术也被称作点击编辑（click-to-edit）或在位编辑（edit-in-place）。
它的想法来源于[x-editable](http://vitalets.github.io/x-editable/)，但是用Angular去书写，同时支持复杂的表单（complex forms）和可编辑的网格（editable grids）。

### Dependencies(依赖)
*  除了Angular Js,它不需要依赖任何库。
关于主题样式你需要包含 Twitter Bootstrap CSS。
一些额外的控件（如DatePicker）你可能需要包括angular-ui bootstrap。
对于ui-select，你需要包括angular-ui ui-select。
对于ngtagsinput你可能需要包括mbenford ngtagsinput。
如果通过NPM安装，jQuery和moment js也将安装。

## Get started(初始)
1、在你的项目中添加Angular Js
`<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js"></script>`

可选添加 Bootstrap CSS 改变样式
`<link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">`

2、安装angular-xeditable 通过bower或者[下载最新压缩文件](http://vitalets.github.io/angular-xeditable/zip/angular-xeditable-0.6.0.zip)
`bower install angular-xeditable `

3、在你的项目中添加angular-xeditable
`<link href="bower_components/angular-xeditable/dist/css/xeditable.css" rel="stylesheet">`
`<script src="bower_components/angular-xeditable/dist/js/xeditable.js"></script>`
4、定义Angular app 同时添加依赖。
`<html ng-app="app">`
`var app = angular.module("app", ["xeditable"]);`

5、在app.run设置主题
```
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
```
6、标记那些可被编辑的元素
```
<div ng-controller="Ctrl">
  <a href="#" editable-text="user.name">{{ user.name || "empty" }}</a>
</div>
```
7、定义控制器
```
app.controller('Ctrl', function($scope) {
  $scope.user = {
    name: 'awesome user'
  };
});
```
8、欣赏。
<button>[预览模板](http://vitalets.github.io/angular-xeditable/starter/)</button>        <button>[模板下载](http://vitalets.github.io/angular-xeditable/zip/angular-xeditable-starter.zip)</button>



## Controls(控制)

### Text(文本)
*    例子=======>[预览](http://jsfiddle.net/NfPcH/25/)
想要是元素通过文本框编辑，只需要添加`editable-text="model.field"`属性。

*    html
```
<div ng-controller="TextSimpleCtrl" id="TextSimpleCtrl">
  <a href="#" editable-text="user.name" e-label="User Name">{{ user.name || 'empty' }}</a>
</div>
```

*    controller.js
```
app.controller('TextSimpleCtrl', function($scope) {
  $scope.user = {
    name: 'awesome user'
  };
});
```

### Select local(本地选项)
*    例子=======>[预览](http://jsfiddle.net/NfPcH/28/)
创建可编辑选项（下拉）需要针对模型设置`editable-select`属性。使用下拉选项你需要定义`e-ng-options`属性，它和普通的Angular `ng-options` 类似，但是它是用原始的元素转换为表面的`<select>`。通过添加`e-placeholder`属性，设置列表的默认选项。

*    html
```
<div ng-controller="SelectLocalCtrl">
  <a href="#" editable-select="user.status" e-ng-options="s.value as s.text for s in statuses">
    {{ showStatus() }}
  </a>
</div>
```

*    controller.js
```
app.controller('SelectLocalCtrl', function($scope, $filter) {
  $scope.user = {
    status: 2
  };

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ];

  $scope.showStatus = function() {
    var selected = $filter('filter')($scope.statuses, {value: $scope.user.status});
    return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
  };
});
```

### Select remote(远程选项)
*    例子=======>[预览](http://jsfiddle.net/NfPcH/29/)
从远程路径（remote url）加载选项，你需要定义`onshow`属性指向scope函数。函数的结果应该是一个$http promise,在加载期间元素是无效的。（不能被点击，等等）。

*    html
```
<div ng-controller="SelectRemoteCtrl">
  <a href="#" editable-select="user.group" onshow="loadGroups()" e-ng-options="g.id as g.text for g in groups">
    {{ user.groupName || 'not set' }}
  </a>
</div>
```

*    controller.js
```
app.controller('SelectRemoteCtrl', function($scope, $filter, $http) {
  $scope.user = {
    group: 4,
    groupName: 'admin' // original value
  };

  $scope.groups = [];

  $scope.loadGroups = function() {
    return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      $scope.groups = data;
    });
  };

  $scope.$watch('user.group', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      var selected = $filter('filter')($scope.groups, {id: $scope.user.group});
      $scope.user.groupName = selected.length ? selected[0].text : null;
    }
  });
});
```

### HTML5 inputs
*    例子=======>[预览](http://jsfiddle.net/NfPcH/82/)
通过`editable-xxx`指令支持HTML5类型：
email
tel
number
search
range
url
color
date
time
month
week
password
datetime-local
在使用特定类型之前，请[检查浏览器支持](http://caniuse.com/)

*    html
```
<div ng-controller="Html5InputsCtrl" id="Html5InputsCtrl">
  <div>Email: <a href="#" editable-email="user.email">{{ user.email || 'empty' }}</a></div>
  <div>Tel: <a href="#" editable-tel="user.tel" e-pattern="\d{3}-\d{2}-\d{2}" e-title="xxx-xx-xx">{{ user.tel || 'empty' }}</a></div>
  <div>Number: <a href="#" editable-number="user.number" e-min="18">{{ user.number || 'empty' }}</a></div>
  <div>Range: <a href="#" editable-range="user.range" e-step="5">{{ user.range || 'empty' }}</a></div>
  <div>Url: <a href="#" editable-url="user.url">{{ user.url || 'empty' }}</a></div>
  <div>Search: <a href="#" editable-search="user.search">{{ user.search || 'empty' }}</a></div>
  <div>Color: <a href="#" editable-color="user.color">{{ user.color || 'empty' }}</a></div>
  <div>Date: <a href="#" editable-date="user.date">{{ (user.date | date: "yyyy-MM-dd") || 'empty' }}</a></div>
  <div>Time: <a href="#" editable-time="user.time">{{ (user.time | date: "HH:mm") || 'empty' }}</a></div>
  <div>Month: <a href="#" editable-month="user.month">{{ (user.month | date: "yyyy-MM") || 'empty' }}</a></div>
  <div>Week: <a href="#" editable-week="user.week">{{ (user.week | date: "yyyy-Www") || 'empty'}}</a></div>
  <div>Password: <a href="#" editable-password="user.password">{{ user.password || 'empty' }}</a></div>
  <div>Datetime-local: <a href="#" editable-datetime-local="user.datetimeLocal">{{ (user.datetimeLocal | date: "yyyy-MM-ddTHH:mm:ss") || 'empty' }}</a></div>
</div>
```

*    controller.js
```
app.controller('Html5InputsCtrl', function($scope) {
  $scope.user = {
    email: 'email@example.com',
    tel: '123-45-67',
    number: 29,
    range: 10,
    url: 'http://example.com',
    search: 'blabla',
    color: '#6a4415',
    date: null,
    time: new Date(1970, 0, 1, 12, 30),
    month: null,
    week: null,
    password: 'password',
    datetimeLocal: null
  };
});
```

### Textarea
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)
创建可编辑文本域需要添加`editable-textarea`属性指向scope模型，你也可以使用`<pre>`标签包裹内容，保留换行符。
数据可以通过`Ctrl + Enter`提交。
也可以通过`Enter`提交，但是需要设置`submit-on-enter="true"`属性。

*    html
```
<div ng-controller="TextareaCtrl" id="TextareaCtrl">
  <a href="#" editable-textarea="user.desc" e-rows="7" e-cols="40">
    <pre>{{ user.desc || 'no description' }}</pre>
  </a>
</div>
```

*    controller.js
```
app.controller('TextareaCtrl', function($scope) {
  $scope.user = {
    desc: 'Awesome user \ndescription!'
  };
});
```

### Checkbox
*    例子=======>[预览](http://jsfiddle.net/NfPcH/33/)
创建可编辑复选框需要添加`editable-checkbox`属性指向scope模型。设置`e-title`属性定义复选框的说明文本。

*    html
```
<div ng-controller="CheckboxCtrl">
  <a href="#" editable-checkbox="user.remember" e-title="Remember?">
    {{ user.remember && "Remember me!" || "Don't remember" }}
  </a>
</div>
```

*    controller.js
```
app.controller('CheckboxCtrl', function($scope) {
  $scope.user = {
    remember: true
  };
});
```


### Checklist
*    例子=======>无
创建多个复选框列表设置`editable-checklist`属性指向模型。你也需要定义`e-ng-options`属性去设置值和陈列每一项。可以定义`e-checklist-comparator`去使用一个函数判断哪一项被选中。
**请注意**：你应该在你的app注入` checklist-mode`指令([ checklist-model directive ](http://vitalets.github.io/checklist-model/)),`var app = angular.module("app", [..., "checklist-model"]);`。
默认情况下复选框水平对其，需要垂直对齐，添加一下样式：
```
.editable-checklist label {
  display: block;
}
```

*    html
```
<div ng-controller="ChecklistCtrl">
  <a href="#" editable-checklist="user.status" e-ng-options="s.value as s.text for s in statuses">
    {{ showStatus() }}
  </a>
</div>
```

*    controller.js
```
app.controller('ChecklistCtrl', function($scope, $filter) {
  $scope.user = {
    status: [2, 3]
  };

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'}
  ];

  $scope.showStatus = function() {
    var selected = [];
    angular.forEach($scope.statuses, function(s) {
      if ($scope.user.status.indexOf(s.value) >= 0) {
        selected.push(s.text);
      }
    });
    return selected.length ? selected.join(', ') : 'Not set';
  };

});
```

### Radiolist
*    例子=======>无
创建单选框列表使用`editable-radiolist`属性指向模型。你也需要使用`e-ng-options`属性去设置值和陈列每一项。默认水平对齐，垂直对齐需要设置一下样式：
```
.editable-radiolist label {
  display: block;
}
```

*    html
```
<div ng-controller="RadiolistCtrl">
  <a href="#" editable-radiolist="user.status" e-ng-options="s.value as s.text for s in ::statuses track by s.value">
    {{ showStatus() }}
  </a>
</div>
```

*    controller.js
```
app.controller('RadiolistCtrl', function($scope, $filter) {
  $scope.user = {
    status: 2
  };

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'}
  ];

  $scope.showStatus = function() {
    var selected = $filter('filter')($scope.statuses, {value: $scope.user.status});
    return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
  };
});
```

### Date
*    例子(Bootstrap 3 version)=======>[预览](http://jsfiddle.net/ckosloski/NfPcH/17531/)
日期控制是通过[ Angular-ui bootstrap datepicker](http://angular-ui.github.io/bootstrap/#/datepicker)。
你需要补充追加`ui-bootstrap-tpls.min.js`:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.1/ui-bootstrap-tpls.min.js"></script>
```
添加`ui.bootstrap`模块依赖
```
var app = angular.module("app", ["xeditable", "ui.bootstrap"]);
```
设置`editable-bsdate`属性在可编辑元素。
设置`e-readonly="true"`属性确保input内容只读和日期只能在弹出框选择。
添加`e-ng-change`属性在日期控件（datepicker）改变的时候调用一个函数。
隐藏日历按钮，在输入栏点击显示日历弹出，设置`e-show-calendar-button`属性为false。
可以通过`e-*`语法结构定义其他的参数，例：`e-datepicker-popup="dd-MMMM-yyyy"`

*    html
```
<div ng-controller="BsdateCtrl">
  <a href="#" editable-bsdate="user.dob"
              e-is-open="opened.$data"
              e-ng-click="open($event,'$data')"
              e-datepicker-popup="dd-MMMM-yyyy">
    {{ (user.dob | date:"dd/MM/yyyy") || 'empty' }}
  </a>
</div>
```

*    controller.js
```
app.controller('BsdateCtrl', function($scope) {
    $scope.user = {
        dob: new Date(1984, 4, 15)
    };

    $scope.opened = {};

    $scope.open = function($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened[elementOpened] = !$scope.opened[elementOpened];
    };
});
```

### UI Date
*    例子=======>无
日期控件的实现通过[ jQuery UI Datepicker for AngularJS](https://github.com/angular-ui/ui-date)
你需要使用`bower`安装`ui-date`:
```
bower install angular-ui-date --save
```
添加css样式：
```
<link rel="stylesheet" href="bower_components/jquery-ui/themes/smoothness/jquery-ui.css"/>
```
加载脚本文件（最小的jQuery版本是v2.2.0）：
```
<script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
<script type="text/javascript" src="bower_components/jquery-ui/jquery-ui.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-date/dist/date.js"></script>
```
添加日期模块作为应用模块的附属：
```
angular.module('MyApp', ['ui.date'])
```
在可编辑元素设置`editable-uidate`属性。
你可以通过`e-ui-date`属性，指向一个拥有你想要的配置的对象。
```
var datePickerOptions = {
    changeYear: true,
    changeMonth: true,
    showOn: "button",
    buttonImage: "build/assets/img/calendar.png",
    buttonImageOnly: true
};
```


*    html
```
<div ng-controller="UidateCtrl">
    <span editable-uidate="user.dob"
        e-ui-date="datePickerConfig">
        {{ (user.dob | date:"dd/MM/yyyy") || 'empty' }}
    </span>
</div>
```

*    controller.js
```
app.controller('UidateCtrl', function($scope) {

    $scope.datePickerConfig = {
        changeYear: true,
        changeMonth: true
    };

    $scope.user = {
        dob: new Date(1985, 3, 11)
    };

});
```

### Time
*    例子=======>[预览(Bootstrap 2)](http://jsfiddle.net/NfPcH/34/)
日期控件通过[Angular-ui bootstrap timepicker](http://angular-ui.github.io/bootstrap/#/timepicker)实现
**目前它只有Bootstrap 2版本**，Bootstrap 3 版本正在进行中。
你应该额外添加`ui-bootstrap-tpls.min.js`:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.1/ui-bootstrap-tpls.min.js"></script>
```
添加`ui.bootstrap`模块依赖：
```
var app = angular.module("app", ["xeditable", "ui.bootstrap"]);
```
在可编辑的元素设置`editable-bstime`属性。可以通过`e-*`语法结构设置其它的参数，例：`e-minute-step="10"`。
想要让Bootstrap 3 起作用需要添加一下样式：
```
/* temporary workaround for display editable-bstime in bs3 - up/down symbols not shown */
.editable-bstime .editable-input i.icon-chevron-up:before {
  content: '\e113';
}
.editable-bstime .editable-input i.icon-chevron-down:before {
  content: '\e114';
}
.editable-bstime .editable-input i.icon-chevron-up,
.editable-bstime .editable-input i.icon-chevron-down {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  -webkit-font-smoothing: antialiased;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
}
```

*    html
```
<div ng-controller="BstimeCtrl">
  <a href="#" editable-bstime="user.time" e-show-meridian="false" e-minute-step="10">
    {{ (user.time | date:"HH:mm") || 'empty' }}
  </a>
</div>
```

*    controller.js
```
app.controller('BstimeCtrl', function($scope) {
  $scope.user = {
    time: new Date(1984, 4, 15, 19, 20)
  };
});
```

### DateTime
*    例子=======>无
你需要添加`moment.js`：
然后，在可编辑元素设置`editable-combodate`属性。可以通过`e-*`语法结构提供被[ Combodate](https://vitalets.github.io/combodate/)支持的自定义选项，例：`e-min-year="2015"` `e-max-year="2025"`。

*    html
```
<div ng-controller="CombodateCtrl">
  <a href="#" editable-combodate="user.dob">
    {{ (user.dob | date:"medium") || 'empty' }}
  </a>
</div>
```

*    controller.js
```
app.controller('CombodateCtrl', function($scope) {
  $scope.user = {
    dob: new Date(1984, 4, 15)
  };
});
```

### Typeahead
*    例子=======>[预览（Bootstrap 2）](http://jsfiddle.net/NfPcH/46/)
Typeahead控件通过[Angular-ui bootstrap typeahead](http://angular-ui.github.io/bootstrap/#/typeahead)实现。
总的来说它是一般的`editable-text`控件添加额外的`e-typeahead`属性。
你需要包含额外的`ui-bootstrap-tpls.min.js`:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.1/ui-bootstrap-tpls.min.js"></script>
```
然后添加`ui.bootstrap`模块依赖：
```
var app = angular.module("app", ["xeditable", "ui.bootstrap"]);
```
最终设置`editable-text`属性指向模块，同时设置`e-uib-typeahead`属性指向`typeahead`子部件。可以通过`e-typeahead-*`语法结构定义其他的参数，例：`e-typeahead-wait-ms="100"`。

*    html
```
<div ng-controller="TypeaheadCtrl" id="TypeaheadCtrl">
  <a href="#" editable-text="user.state" e-uib-typeahead="state for state in states | filter:$viewValue | limitTo:8">
    {{ user.state || 'empty' }}
  </a>
</div>
```

*    controller.js
```
app.controller('TypeaheadCtrl', function($scope) {
  $scope.user = {
    state: 'Arizona'
  };

  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
});
```

### UI-Select
*    例子=======>无
UI-Select控件是通过[ AngularJS-native version of Select2 and Selectize](https://github.com/angular-ui/ui-select)实现。
你需要包含额外的`select.min.js`和`select.min.css`：
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.16.1/select.min.js"></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.16.1/select.min.css" rel="stylesheet" media="screen">
```
然后添加`ui.select`模块依赖：
```
var app = angular.module("app", ["xeditable", "ui.select"]);
```
最终设置`editable-ui-select`属性指向模块、`editable-ui-select-match`指向匹配标准、`editable-ui-select-choices`指向选择。

*    html
```
<div ng-controller="UiSelectCtrl">
  <form data-editable-form name="uiSelectForm">
    <div editable-ui-select="user.state" data-e-form="uiSelectForm" data-e-name="state" name="state" theme="bootstrap" data-e-ng-model="user.state" data-e-style="min-width:300px;">
      {{user.state}}
      <editable-ui-select-match placeholder="State">
          {{$select.selected}}
      </editable-ui-select-match>
      <editable-ui-select-choices repeat="state in states | filter: $select.search track by $index">
        {{state}}
      </editable-ui-select-choices>
    </div>
    <br/>
    <div class="buttons">
      <!-- button to show form -->
      <button type="button" class="btn btn-default" ng-click="uiSelectForm.$show()" ng-show="!uiSelectForm.$visible">
        Edit
      </button>
      <!-- buttons to submit / cancel form -->
      <span ng-show="uiSelectForm.$visible">
        <br/>
        <button type="submit" class="btn btn-primary" ng-disabled="uiSelectForm.$waiting">
          Save
        </button>
        <button type="button" class="btn btn-default" ng-disabled="uiSelectForm.$waiting" ng-click="uiSelectForm.$cancel()">
          Cancel
        </button>
      </span>
    </div>
  </form>
</div>
```

*    controller.js
```
app.controller('UiSelectCtrl', function($scope) {
  $scope.user = {
    state: 'Arizona'
  };

  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
});
```

### ngTagsInput
*    例子=======>无
ngTagsInput控件是通过[ Tags input directive for AngularJS](http://mbenford.github.io/ngTagsInput/)实现的。
你需要包含额外的`ng-tags-input.min.js`和`ng-tags-input.min.css`和`ng-tags-input.bootstrap.min.css`(如果使用Bootstrap)：
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.1.1/ng-tags-input.min.js"></script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.1.1/ng-tags-input.min.css" rel="stylesheet" media="screen">

<link href="https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.1.1/ng-tags-input.bootstrap.min.css" rel="stylesheet" media="screen">
```
然后添加`ngTagsInput`模块依赖：
```
var app = angular.module("app", ["xeditable", "ngTagsInput"]);
```
最终设置`editable-tags-input`属性指向模块，还有添加`editable-tags-input-auto-complete`标签做到自动完成标准。

*    html
```
<div ng-controller="NgTagsCtrl">
  <form data-editable-form name="ngTagsForm">
    <div editable-tags-input="user.tags" data-e-form="ngTagsForm" data-e-name="tags" name="tags" data-e-ng-model="user.tags">
      {{user.tags}}
        <editable-tags-input-auto-complete source="loadTags($query)"></editable-tags-input-auto-complete>
    </div>
    <br/>
    <div class="buttons">
      <!-- button to show form -->
      <button type="button" class="btn btn-default" ng-click="ngTagsForm.$show()" ng-show="!ngTagsForm.$visible">
        Edit
      </button>
      <!-- buttons to submit / cancel form -->
      <span ng-show="ngTagsForm.$visible">
        <br/>
        <button type="submit" class="btn btn-primary" ng-disabled="ngTagsForm.$waiting">
          Save
        </button>
        <button type="button" class="btn btn-default" ng-disabled="ngTagsForm.$waiting" ng-click="ngTagsForm.$cancel()">
          Cancel
        </button>
      </span>
    </div>
  </form>
</div>
```

*    controller.js
```
app.controller('NgTagsCtrl', function($scope, $http) {
  $scope.user = {
    tags: [
      { text: 'Tag1' },
      { text: 'Tag2' },
      { text: 'Tag3' }
    ],
  };

  $scope.loadTags = function(query) {
    return $http.get('/tags?query=' + query);
  };
});
```

## Techniques(技巧)


### Customize input（自定义输入）
*    例子=======>[预览](http://jsfiddle.net/NfPcH/26/)
定义input属性（例如：`style`或者`placeholder`）你可以使用`e-*`语法结构在元素上定义它们（例：`e-style `或 `e-placeholder`）。
当input出现这些属性的时候，将被转换。
自定义输入框上的类名，添加`e-formclass`给需要添加的类。
使用简单的Bootstrap输入框组添加`e-inputgroupleft`或`e-inputgroupright`任意一个，同时还有你想要呈现的文本内容。

*    html
```
<div ng-controller="TextCustomizeCtrl" id="TextCustomizeCtrl">
  <a href="#" editable-text="user.name"
              e-style="color: green"
              e-required
              e-placeholder="Enter name"
              e-formclass="class1 class2"
              e-inputgroupleft="left"
              e-inputgroupright="right">
    {{ (user.name || 'empty') | uppercase }}
  </a>
</div>
```

*    controller.js
```
app.controller('TextCustomizeCtrl', function($scope) {
  $scope.user = {
    name: 'awesome user'
  };
});
```

### Trigger manually（手动触发）
*    例子=======>[预览](http://jsfiddle.net/NfPcH/27/)
你需要定义`e-form`属性通过外部按钮触发在位编辑（edit-in-place）。
值是在作用域中创建的变量的名称，它允许您手动显示/隐藏编辑。
触发`e-form`在位编辑同时没有一个按钮元素，添加`e-clickable="true"`。
这将允许你在ng-repeat中自定义单个元素的表单名称

*    html
```
<div ng-controller="TextBtnCtrl" id="TextBtnCtrl">
  <span editable-text="user.name" e-form="textBtnForm">
    {{ user.name || 'empty' }}
  </span>
  <button class="btn btn-default" ng-click="textBtnForm.$show()" ng-hide="textBtnForm.$visible">
    edit
  </button>
</div>
```

*    controller.js
```
app.controller('TextBtnCtrl', function($scope) {
  $scope.user = {
    name: 'awesome user'
  };
});
```

### Hide buttons
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Select multiple
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Validate local
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Validate remote
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Disable editing
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Editable Popover
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```


## Submit（提交）

### Submit via onbeforesave
*    例子=======>[预览](http://jsfiddle.net/NfPcH/37/)
提交数据到服务器的一种方法是定义`onbeforesave`属性指向一些scope方法。有用的是当你首先需要发送数据到服务器，然后更新本地模型（例：`$scope.user`）。新的值可以作为`$data`参数被传递通过（例：`<a ... onbeforesave="updateUser($data)">`）。
最重要的事情是当方法返回`true`或者`undefined`(或者promise决定`true/undefined`)本地模型将被更新。通常有3中情况取决于结果类型：
    *    `true`或`undefined`:Success。本地模型将自动更新，表单将关闭。
    *    `false`:Success。但本地模型**不会**更新，表单将关闭。当您想手动更新本地模型时很有用。（例：服务器返回值）。
    *    `string`:Error。本地模型**不会**被更新，表单**不会**关闭，字符串会显示为错误信息。用于验证和处理错误。


*    html
```
<div ng-controller="OnbeforesaveCtrl" id="OnbeforesaveCtrl">
  <a href="#" editable-text="user.name" onbeforesave="updateUser($data)">
    {{ user.name || 'empty' }}
  </a>
</div>
```

*    controller.js
```
app.controller('OnbeforesaveCtrl', function($scope, $http) {
  $scope.user = {
    id: 1,
    name: 'awesome user'
  };

  $scope.updateUser = function(data) {
    return $http.post('/updateUser', {id: $scope.user.id, name: data});
  };
});
```

### Submit via onaftersave
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

## Forms(表单) {#form}


### Editable form
*    例子=======>[预览](http://jsfiddle.net/NfPcH/81/)
想要展示数个可编辑元素，并且一次性提交，你需要在外边包裹`<form editable-form name="myform" ...>`标签。表单的`name`属性会创造scope变量（正常的Angular行为），同时`editable-form`属性会为变量添加一些方法：
    *   $show()
    *    $cancel()
    *    $visible
    *    $waiting

*    使用它切换表单的编辑状态。例如，你可以命名为`myform.$show()`。
可编辑表单支持三种额外的属性：
    *   onshow：定义表单出现时间。
    *   onbeforesave：定义在本地模型更新前提交。
    *   onaftersave：定义在本地模型更新后提交。

*    它的运行方式和单独的可编辑元素几乎一样。使用它而不是`ng-submit / submit`在保存的过程中得到更多的控制。
当你提交可编辑表单它执行一下几个步骤：
    *    1.命令子元素的`onbeforesave`。
         2.命令表单的`onbeforesave`。
         3.写本地模型数据（例：`$scope.user`）。
         4.命令表单的`onaftersave`。
         5.命令子元素的`onaftersave`。

*    关于`onbeforesave / onaftersave`都可以被省略，所以在最简单的实例中你只需要书写本地模型的数据。
但是在复杂的情况下它变得很有用：

*    如果你需要**验证个别的可编辑元素**那么你需要在个别的可编辑元素定义`onbeforesave`。
子元素的`onbeforesave`结果对与下一步是非常重要的：
    *    `string`：提交将被取消，表单将继续打开，字符串将显示为错误信息。
    *    `not string`:提交将会继续。
*    如果你需要**在写入本地模型之前发送数据到服务器**那么你需要定义表单的`onbeforesave`。
表单的`onbeforesave`结果对与下一步是非常重要的：
    *    `true`或`undefined`：本地模型将被更新，表单将继续执行`onaftersave`。
    *    `false`:本地模型**不会**被更新，表单将关闭。（例：你自己更新本地模型）。
    *    `string`:本地模型**不会**被更新，表单**不会**关闭。（例：服务器错误）。
*    如果你需要**在写入本地模型之后发送数据到服务器**那么你需要定义表单的`onaftersave`。
表单的`onaftersave`结果对与下一步是非常重要的：
    *    `string`：表单不会关闭（例：服务器错误）。
    *    `not string`:表单将关闭。
通常你需要对子元素定义`onbeforesave`进行验证同时对整个表单定义`onaftersave`发送数据到服务器。
注释：`e-required`将在HTML5的验证中不会起作用只会在一个按钮提交表单的时候起作用同时`editable-form`通过脚本提交。


*    html
```
<div ng-controller="EditableFormCtrl" id="EditableFormCtrl">
  <form editable-form name="editableForm" onaftersave="saveUser()">
    <div>
      <!-- editable username (text with validation) -->
      <span class="title">User name: </span>
      <span editable-text="user.name" e-name="name" onbeforesave="checkName($data)" e-required>{{ user.name || 'empty' }}</span>
    </div>

    <div>
      <!-- editable status (select-local) -->
      <span class="title">Status: </span>
      <span editable-select="user.status" e-name="status" e-ng-options="s.value as s.text for s in statuses">
        {{ (statuses | filter:{value: user.status})[0].text || 'Not set' }}
      </span>
    </div>

    <div>
      <!-- editable group (select-remote) -->
      <span class="title">Group: </span>
      <span editable-select="user.group" e-name="group" onshow="loadGroups()" e-ng-options="g.id as g.text for g in groups">
        {{ showGroup() }}
      </span>
    </div>

    <div class="buttons">
      <!-- button to show form -->
      <button type="button" class="btn btn-default" ng-click="editableForm.$show()" ng-show="!editableForm.$visible">
        Edit
      </button>
      <!-- buttons to submit / cancel form -->
      <span ng-show="editableForm.$visible">
        <button type="submit" class="btn btn-primary" ng-disabled="editableForm.$waiting">
          Save
        </button>
        <button type="button" class="btn btn-default" ng-disabled="editableForm.$waiting" ng-click="editableForm.$cancel()">
          Cancel
        </button>
      </span>
    </div>
  </form>
</div>
```

*    controller.js
```
app.controller('EditableFormCtrl', function($scope, $filter, $http) {
  $scope.user = {
    id: 1,
    name: 'awesome user',
    status: 2,
    group: 4,
    groupName: 'admin'
  };

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ];

  $scope.groups = [];
  $scope.loadGroups = function() {
    return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      $scope.groups = data;
    });
  };

  $scope.showGroup = function() {
    if($scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {id: $scope.user.group});
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return $scope.user.groupName;
    }
  };

  $scope.checkName = function(data) {
    if (data !== 'awesome' && data !== 'error') {
      return "Username should be `awesome` or `error`";
    }
  };

  $scope.saveUser = function() {
    // $scope.user already updated!
    return $http.post('/saveUser', $scope.user).error(function(err) {
      if(err.field && err.msg) {
        // err like {field: "name", msg: "Server-side error for this username!"}
        $scope.editableForm.$setError(err.field, err.msg);
      } else {
        // unknown error
        $scope.editableForm.$setError('name', 'Unknown error!');
      }
    });
  };
});
```

## Tables(表格)


### Editable row
*    例子=======>[预览](http://jsfiddle.net/NfPcH/93/)
创建可编辑行表格，你需要在单元格中放置`e-form`属性指向表单的名称。表单在最后出现（例：在最后一列），但是它将会执行。不要忘记在表单上添加`editable-form`属性。
表单的运行和可编辑的表单部分（[Editable form](#form)）一样。

*    html
```
<div ng-controller="EditableRowCtrl">
  <table class="table table-bordered table-hover table-condensed">
    <tr style="font-weight: bold">
      <td style="width:35%">Name</td>
      <td style="width:20%">Status</td>
      <td style="width:20%">Group</td>
      <td style="width:25%">Edit</td>
    </tr>
    <tr ng-repeat="user in users">
      <td>
        <!-- editable username (text with validation) -->
        <span editable-text="user.name" e-name="name" e-form="rowform" onbeforesave="checkName($data, user.id)">
          {{ user.name || 'empty' }}
        </span>
      </td>
      <td>
        <!-- editable status (select-local) -->
        <span editable-select="user.status" e-name="status" e-form="rowform" e-ng-options="s.value as s.text for s in statuses">
          {{ showStatus(user) }}
        </span>
      </td>
      <td>
        <!-- editable group (select-remote) -->
        <span editable-select="user.group" e-name="group" onshow="loadGroups()" e-form="rowform" e-ng-options="g.id as g.text for g in groups">
          {{ showGroup(user) }}
        </span>
      </td>
      <td style="white-space: nowrap">
        <!-- form -->
        <form editable-form name="rowform" onbeforesave="saveUser($data, user.id)" ng-show="rowform.$visible" class="form-buttons form-inline" shown="inserted == user">
          <button type="submit" ng-disabled="rowform.$waiting" class="btn btn-primary">
            save
          </button>
          <button type="button" ng-disabled="rowform.$waiting" ng-click="rowform.$cancel()" class="btn btn-default">
            cancel
          </button>
        </form>
        <div class="buttons" ng-show="!rowform.$visible">
          <button type="button" class="btn btn-primary" ng-click="rowform.$show()">edit</button>
          <button type="button" class="btn btn-danger" ng-click="removeUser($index)">del</button>
        </div>
      </td>
    </tr>
  </table>

  <button type="button" class="btn btn-default" ng-click="addUser()">Add row</button>
</div>
```

*    controller.js
```
app.controller('EditableRowCtrl', function($scope, $filter, $http) {
  $scope.users = [
    {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
    {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
    {id: 3, name: 'awesome user3', status: 2, group: null}
  ];

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ];

  $scope.groups = [];
  $scope.loadGroups = function() {
    return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      $scope.groups = data;
    });
  };

  $scope.showGroup = function(user) {
    if(user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {id: user.group});
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {id: id});
    return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null
    };
    $scope.users.push($scope.inserted);
  };
});
```

### Editable column
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Editable table
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

## Themes（主题）


### Bootstrap 3
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Bootstrap 2
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### Default
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

## Reference（参考）

### editable element
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### editable form
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

### editable options
*    例子=======>[预览](http://jsfiddle.net/NfPcH/32/)


*    html
```

```

*    controller.js
```

```

