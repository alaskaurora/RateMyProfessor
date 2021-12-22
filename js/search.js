function getValuesInObjs(arr, key) {
    var resultArr = new Array();
    arr.forEach(function (obj) {
        if (!resultArr.includes(obj[key])) {
            resultArr.push(obj[key]);
        }
    });
    return resultArr.sort(function (item1, item2) {
        return item1.localeCompare(item2, 'zh');
    });
}
function filterValuesInArray(arr, key, value) {
    var resultArr = new Array();
    arr.forEach(function (obj) {
        if (obj[key] == value) {
            resultArr.push(obj);
        }
    });
    return resultArr;
}
function setSelectOptions(selector, options) {
    selector.empty();
    options.forEach(function (value, i) {
        var option = new Option(value, i);
        selector.append($(option));
        //option.selected = true;
    });
}
function showComments(sortFunc) {
    contentDiv.empty();
    currentCm.sort(sortFunc);
    currentCm.forEach(function (value, i) {
        var desc = value['description'];
        var rate = value['rate'];
        var date = value['date'];
        var card = $(`<div class="card mb-3">
                    <div class="card-header">
                    <div class="row">
                        <div class="col">
                            <h5>${currentUn}${currentDp}</h5>
                        </div>
                        <div class="col" style="text-align: right;">
                            <h5>${date}</h5>
                        </div>
                    </div>
                </div>
                    <div class="card-body">
                        <h3 class="card-title">${currentSp}</h3>
                        <p class="card-text">评分：${rate}</p>
                        <p class="card-text">${desc}</p>
                    </div></div >`);
        contentDiv.append($(card));
    })
}
//Selectors
var schoolcate = $('#schoolcateSelector');
var university = $('#universitySelector');
var department = $('#departmentSelector');
var supervisor = $('#supervisorSelector');
//Buttons and Divs
var confirmBtn = $('#confirmBtn');
var timeAscBtn = $('#time-asc');
var timeDesBtn = $('#time-des');
var countDesBtn = $('#count-des');
var rateAscBtn = $('#rate-asc');
var rateDesBtn = $('#rate-des');
var contentDiv = $('.descriptions');
var commentsNumDiv = $('#comments-num');
//Initialize selection conditions
var schoolcates = getValuesInObjs(data, 'school_cate')
var universities = new Array();
var departments = new Array();
var supervisors = new Array();
var currentCt = '';
var currentUn = '';
var currentDp = '';
var currentSp = '';
var commentsCnt = 0;
var currentCm = new Array();
//Selector change functions
schoolcate.change(function () {
    currentCt = schoolcates[schoolcate.val()];
    var thisData = filterValuesInArray(data, 'school_cate', currentCt);
    universities = getValuesInObjs(thisData, 'university');
    setSelectOptions(university, universities);
    university.trigger('change');
});
university.change(function () {
    currentUn = universities[university.val()];
    var thisData = filterValuesInArray(data, 'university', currentUn);
    departments = getValuesInObjs(thisData, 'department');
    setSelectOptions(department, departments);
    department.trigger('change');
});
department.change(function () {
    currentDp = departments[department.val()];
    var thisData = filterValuesInArray(data, 'university', currentUn);
    thisData = filterValuesInArray(thisData, 'department', currentDp);
    supervisors = getValuesInObjs(thisData, 'supervisor');
    setSelectOptions(supervisor, supervisors);
    supervisor.trigger('change');
})
supervisor.change(function () {
    currentSp = supervisors[supervisor.val()];
})
//Button click functions
confirmBtn.click(function () {
    var thisData = filterValuesInArray(data, 'university', currentUn);
    thisData = filterValuesInArray(thisData, 'department', currentDp);
    thisData = filterValuesInArray(thisData, 'supervisor', currentSp);
    currentCm = thisData;
    counts = thisData.length;
    commentsNumDiv.empty();
    commentsNumDiv.append(`检索到${counts}条评论`);
    showComments(function (a, b) { return Date.parse(a['date']) - Date.parse(b['date']); })
});
timeAscBtn.click(function () {
    showComments(function (a, b) { return Date.parse(a['date']) - Date.parse(b['date']); })
})
timeDesBtn.click(function () {
    showComments(function (a, b) { return Date.parse(b['date']) - Date.parse(a['date']); })
})
countDesBtn.click(function () {
    showComments(function (a, b) { return b['counts'] - a['counts']; })
})
rateAscBtn.click(function () {
    showComments(function (a, b) { return a['rate'] - b['rate']; })
})
rateDesBtn.click(function () {
    showComments(function (a, b) { return b['rate'] - a['rate']; })
})
setSelectOptions(schoolcate, schoolcates);
schoolcate.trigger('change');
