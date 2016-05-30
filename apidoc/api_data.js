define({ "api": [
  {
    "type": "post",
    "url": "/authenticate",
    "title": "Authenticate User",
    "name": "Authenticate",
    "group": "Auth",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Authenticate the user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Verify the token in localstorage",
    "name": "VerifyToken",
    "group": "Auth",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Token provided.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/cron",
    "title": "Delete inactives users",
    "name": "Cron_Delete_Users",
    "group": "Cron",
    "description": "<p>Runs every Monday at 03:00 a.m.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>List all users deleted.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/cron/cron.js",
    "groupTitle": "Cron"
  },
  {
    "type": "post",
    "url": "/dashboards",
    "title": "Create a Dashboard",
    "name": "Create_a_Dashboard",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dashboard.text",
            "description": "<p>req.body.text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dashboard.owner",
            "description": "<p>req.body.getDashboardOwner</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Dashboard created.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "delete",
    "url": "/dashboards/:_id",
    "title": "Delete Dashboard by Id",
    "name": "Delete_dashboard_by_id",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>_id of the dashboard selected.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Dashboard Successfully deleted.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "get",
    "url": "/dashboards/:owner",
    "title": "Get All Dashboards by Owner",
    "name": "Get_all_dashboards_by_owner",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "owner",
            "description": "<p>owner of the dashboard.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "dashboards",
            "description": "<p>List of dashboards of this owner.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "get",
    "url": "/dashboards/:_id",
    "title": "Get Dashboard by Id",
    "name": "Get_dashboard_by_id",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>_id of the dashboard selected.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "dashboard",
            "description": "<p>dashboard selected.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "put",
    "url": "/updateTaskIndexes",
    "title": "Update Task Indexes",
    "name": "Update_Task_Indexes",
    "group": "Dashboard",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Indexes updated.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "post",
    "url": "/sendRegister/:email/:username",
    "title": "Send Register",
    "name": "Send_Register",
    "group": "Mail",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username if the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Authenticate the user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Mail"
  },
  {
    "type": "get",
    "url": "/verify",
    "title": "Verify Register",
    "name": "Verify",
    "group": "Mail",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Email verified correct.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Mail"
  },
  {
    "type": "post",
    "url": "/task",
    "title": "Create Task",
    "name": "Create_Task",
    "group": "Tasks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "task.index",
            "description": "<p>req.body.index</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "task.sprint",
            "description": "<p>req.body.sprint</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "task.storyPoints",
            "description": "<p>req.body.storyPoints</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "task.priority",
            "description": "<p>req.body.priority</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task.name",
            "description": "<p>req.body.name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task.description",
            "description": "<p>req.body.description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task.asignedTo",
            "description": "<p>req.body.asignedTo</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Task created!.. name.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Tasks"
  },
  {
    "type": "delete",
    "url": "/task/:_id",
    "title": "Delete Task by Id",
    "name": "Delete_task",
    "group": "Tasks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>_id of the task to delete.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Task Successfully deleted.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Tasks"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create User",
    "name": "Create_User",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>req.body.email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>req.body.username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>req.body.password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>User created!.. email: +  -- username:.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Users"
  },
  {
    "type": "delete",
    "url": "/users/:user_id",
    "title": "Delete User by Id",
    "name": "Delete_User_by_Id",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>id of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>User successfully deleted.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "/users/:user_id",
    "title": "Edit User",
    "name": "Edit_user",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>id of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>req.body.username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>req.body.password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>updated.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get All Users",
    "name": "Get_All_Users",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>List of user profiles.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/:user_id",
    "title": "Get User by Id",
    "name": "Get_User_by_Id",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user_id",
            "description": "<p>id of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/userName/:username",
    "title": "Get User by UserName",
    "name": "Get_User_by_UserName",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>user.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Users"
  }
] });
