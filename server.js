
const http = require('http');
const Koa = require('koa')
const koaBody = require('koa-body');
const tasksList = require('./tasks.json');

const uuid = require('uuid');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  json: true,
}));


app.use((ctx, next) => {
  const { method, id } = ctx.request.query
  if (ctx.request.method === 'GET') {
    if (method === 'allTickets') {
      ctx.response.status = 200;
      ctx.response.set('Access-Control-Allow-Origin', '*');
      ctx.response.body = JSON.stringify(tasksList);
      next();
    }
    if (method === 'ticketById') {
  
      ctx.response.status = 200;
      ctx.response.set('Access-Control-Allow-Origin', '*');
      
      const currTaskDescr = tasksList.find((element) => element.id===id.trim());
      if (currTaskDescr) {
        ctx.response.body = JSON.stringify(currTaskDescr);
      } else {
        ctx.response.body = "description not finded";
      }
  
      next();
    }
    if (method === 'updateStatusById') {
      ctx.response.status = 200;
      ctx.response.set('Access-Control-Allow-Origin', '*');
      
      const currTaskStatus = tasksList.find((element) => element.id===id.trim());
      if (currTaskStatus) {
        currTaskStatus.status = !currTaskStatus.status;
        ctx.response.body = JSON.stringify(currTaskStatus);
      } else {
        ctx.response.body = "task not finded";
      }
  
      next();
    }
    if (method === 'deleteById') {
      ctx.response.status = 200;
      ctx.response.set('Access-Control-Allow-Origin', '*');

      const currTaskInd = tasksList.findIndex((element) => element.id===id.trim());
      if (currTaskInd >=0) {
        tasksList.splice(currTaskInd, 1);
      } else {
        ctx.response.body = "task not found";
      }
      next();
    }
  }
  if (ctx.request.method === 'POST') {
    const { shortDescr, longDescr } = ctx.request.body;
    if (method === 'updateById') {
      const currTaskDescr = tasksList.find((element) => element.id===id.trim());

      currTaskDescr.name = shortDescr;
      currTaskDescr.description = longDescr;
      ctx.response.status = 200;
      ctx.response.set('Access-Control-Allow-Origin', '*');
      ctx.response.body = "OKE";
      next()
    }
    if (method === 'createTicket') {
      ctx.response.status = 200;
      ctx.response.set('Access-Control-Allow-Origin', '*');
      ctx.response.body = "OKE";
      const date = new Date(Date.now());
      const newTicket = {
        id: uuid.v4(),
        name: shortDescr,
        status: false,
        description: longDescr,
        created: date
      }
      tasksList.push(newTicket);
      next();
    }
  }
  

})



const server = http.createServer(app.callback())
const port = 7070;

server.listen(port, (err) => {
  if (err) {
    return console.log('Error occured:', error)
  }
  console.log(`server is listening on ${port}`)
});
