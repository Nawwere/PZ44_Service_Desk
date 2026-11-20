const form = document.querySelector("#ticket-form");
const list = document.querySelector("#ticket-list");
const status = document.querySelector("#status");
const summary = document.querySelector("#summary");
const refreshButton = document.querySelector("#refresh-button");
const sendButton = document.querySelector("#send-button");
function setStatus(text, kind = "info") {
  status.textContent = text;
  status.dataset.kind = kind;
}
function renderTickets(items) {
  // TODO 1: очистите list и создайте карточку каждого обращения через createElement/textContent.
  // В карточке нужны номер #id, имя, текст проблемы и статус.
  function renderTickets(items) {
      list.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Обращений пока нет";
    list.append(empty);
    return;
  }
  items.forEach((ticket) => {
    const card = document.createElement("article");
    card.className = "ticket";
    const number = document.createElement("h3");
    number.textContent = `Заявка #${ticket.id}`;
    const customer = document.createElement("p");
    customer.textContent = `Автор: ${ticket.customer}`;
    const problem = document.createElement("p");
    problem.textContent = `Проблема: ${ticket.problem}`;
    const ticketStatus = document.createElement("span");
    ticketStatus.textContent = `Статус: ${ticket.status}`;
    card.append(number, customer, problem, ticketStatus);
    list.append(card);
  });
}
}
async function loadTickets() {
  // TODO 2: GET /api/tickets → проверка response.ok → response.json() → renderTickets(data.items).
  // Отобразите data.total в #summary; ошибки покажите через setStatus().
  async function loadTickets() {
  try {
    setStatus("Загружаем обращения...");
    const response = await fetch("/api/tickets");
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    renderTickets(data.items);
    summary.textContent = `Всего обращений: ${data.total}`;
    setStatus("Обращения успешно загружены", "success");
  } catch (error) {
    setStatus(`Ошибка загрузки: ${error.message}`, "error");
    summary.textContent = "Не удалось загрузить обращения";
  }
}
  setStatus("TODO: выполните GET-запрос");
}
async function createTicket(payload) {
  // TODO 3: POST /api/tickets с заголовком Content-Type: application/json.
  // Передайте JSON.stringify(payload); проверьте код ответа и прочитайте JSON.
  async function createTicket(payload) {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Ошибка HTTP: ${response.status}`);
  }
  return data;
}
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // TODO 4: проверьте данные, отключите sendButton на период запроса,
  // вызовите createTicket(), очистите поля после успеха и обновите список через GET.
  form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const customer = customerInput.value.trim();
  const problem = problemInput.value.trim();
  if (customer.length < 2) {
    setStatus("Имя должно содержать минимум 2 символа", "error");
    return;
  }
  if (problem.length < 5) {
    setStatus("Описание проблемы должно содержать минимум 5 символов", "error");
    return;
  }
  sendButton.disabled = true;
  setStatus("Отправляем обращение...");
  try {
    const result = await createTicket({
      customer: customer,
      problem: problem
    });
    setStatus(result.message, "success");
    form.reset();
    await loadTickets();
  } catch (error) {
    setStatus(`Ошибка отправки: ${error.message}`, "error");
  } finally {
    sendButton.disabled = false;
  }
});
  setStatus("TODO: обработайте отправку формы");
});
refreshButton.addEventListener("click", loadTickets);
// TODO 5: вызовите loadTickets() при загрузке страницы.
loadTickets();