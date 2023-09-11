
const http = require('http');
const Koa = require('koa')
const koaBody = require('koa-body')
const tasksList = require('./tasks.json')
const uuid = require('uuid');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  json: true,
}));


app.use((ctx, next) => {
  const { method, id } = ctx.request.query
  if (ctx.request.method !== 'GET') {
    next();
    return;
  }
  if (method === 'allTickets') {
    ctx.response.status = 200;
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = JSON.stringify(tasksList);
    next();
  }
  if (method === 'ticketById') {

    ctx.response.status = 200;
    ctx.response.set('Access-Control-Allow-Origin', '*');

    const currTaskDescr = tasksList.find((el) => el.id == id);
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

    const currTask = tasksList.find((el) => el.id == id);

    if (currTask) {
      currTask.status = !currTask.status;
      ctx.response.body = JSON.stringify(currTask.status);
    } else {
      ctx.response.body = "task not finded";
    }

    next();
  }
  if (method === 'deleteById') {
    ctx.response.status = 200;
    ctx.response.set('Access-Control-Allow-Origin', '*');

    const currTaskInd = tasksList.indexOf((el) => el.id == id);

    if (currTaskInd) {
      tasksList.splice(currTaskInd, 1)
    } else {
      ctx.response.body = "task not found";
    }

    next();
  }

})
app.use((ctx, next) => {
  if (ctx.request.method !== 'POST') {
    next();
    return;
  }
  const { shortDescr, longDescr } = ctx.request.body;
  const { method, id } = ctx.request.query
  if (method === 'updateById') {
    const currTaskDescr = tasksList.find((el) => el.id == id);
    currTaskDescr.name = shortDescr;
    currTaskDescr.description = longDescr;
    ctx.response.status = 200;
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = "OKE";
    next()
  }
  if (method === 'createTicket') {
    const date = new Date(Date.now());
    tasksList.push({
      id: uuid.v4(),
      name: shortDescr,
      status: false,
      description: longDescr,
      created: date
    })
    ctx.response.status = 200;
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = "OKE";
    next();
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
