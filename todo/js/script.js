Vue.component( 'todo-item' , {
  props: ['todo', 'index', 'filter'],
  template:`<li>
    <input type="checkbox" @change="updateStatus(todo)" :checked="todo.isCompleted">
    <label v-if="!todo.isEdit" :class="[todo.isCompleted ? 'completed' : '']">{{ todo.text }}</label>
    <input type="text" v-if="todo.isEdit" @keyup.enter="updateTodo($event, todo)" v-model="todo.text" />
    <a @click="editTodo(todo)" v-if="!todo.isEdit" class="btn">編輯</a>
    <a @click="remove(index)" class="btn">刪除</a>
  </li>`,
  methods: {
    remove: function(index) {
      this.$emit('remove');
    },
    updateTodo: function($event, todo) {
      if($event.target.value) {
        todo.text = $event.target.value;
      }
      todo.isEdit = !todo.isEdit;
    },
    updateStatus: function(todo) {
      todo.isCompleted = !todo.isCompleted;
    },
    editTodo: function(todo) {
      todo.isEdit = !todo.isEdit;
    },
    showCompletedTodo: function(isCompleted, filter) {
      return !(!isCompleted && filter === 'show_completed');
    }
  }
});

let app = new Vue({
  el: '#app',
  data: {
    todos: {
      "a5436691-350c-4ed0-862e-c8abc8509a4a": {
        "uuid": "a5436691-350c-4ed0-862e-c8abc8509a4a",
        "text": "JavaScript",
        "isCompleted": false,
        "isEdit": false
      },
      "a98bf666-a710-43b2-81b2-60c68ec4688d": {
        "uuid": "a98bf666-a710-43b2-81b2-60c68ec4688d",
        "text": "Laravel",
        "isCompleted": true,
        "isEdit": false
      },
      "452ef417-033d-48ff-9fec-9d686c105dce": {
        "uuid": "452ef417-033d-48ff-9fec-9d686c105dce",
        "text": "Vue.js",
        "isCompleted": false,
        "isEdit": false
      }
    },
    newTodoText: '',
    filter: 'show_all'
  },
  computed: {
    todosData: function() {
      return JSON.stringify(this.todos);
    },
    list: function() {
      if(this.filter === 'show_all') {
        return this.todos;
      } else if (this.filter === 'show_completed') {
        return this._getTodos(true);
      } else { //show_incomplete
        return this._getTodos(false);
      }
    },
    allCount: function() {
      return Object.keys(this.todos).length;
    },
    completedCount: function() {
      let _this = this;

      return Object.keys(this.todos).filter(function(value) {
        return _this.todos[value].isCompleted
      }).length;
    },
    incompleteCount: function() {
      let _this = this;

      return Object.keys(this.todos).filter(function(value) {
        return !_this.todos[value].isCompleted
      }).length;
    }
  },
  methods: {
    add: function() {
      let id = this._uuid();

      Vue.set(this.todos, id, {
        uuid: id,
        text: this.newTodoText,
        isCompleted: false,
        isEdit: false
      });

      this.newTodoText = '';
    },
    del: function(index) {
      Vue.delete(this.todos, index);
    },
    setFilter: function(filter) {
      this.filter = filter;
    },
    _uuid: function() {
      let d = Date.now();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },
    _getTodos: function(isCompleted) {
      let list = {};

      for(var index in this.todos) {
        if(this.todos[index].isCompleted === isCompleted) {
          list[index] = this.todos[index];
        }
      }
      return list;
    },
    _getObjContent: function (data) {
      return  Object.keys(data).map(function(index){
        return data[index];
      });
    }
  }
});
