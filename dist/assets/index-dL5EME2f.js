(function () {
  const r = document.createElement("link").relList;
  if (r && r.supports && r.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
  new MutationObserver((n) => {
    for (const o of n)
      if (o.type === "childList")
        for (const d of o.addedNodes)
          d.tagName === "LINK" && d.rel === "modulepreload" && s(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(n) {
    const o = {};
    return (
      n.integrity && (o.integrity = n.integrity),
      n.referrerPolicy && (o.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : n.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }
  function s(n) {
    if (n.ep) return;
    n.ep = !0;
    const o = a(n);
    fetch(n.href, o);
  }
})();
function $(e) {
  return String(e).trim().length > 0;
}
function ce() {
  return new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function ue(e) {
  const r = String(e).trim().split(/\s+/).filter(Boolean);
  return r.length === 0
    ? ""
    : r.length === 1
      ? r[0].slice(0, 2).toUpperCase()
      : r
          .map((a) => a[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
}
function be(e, r, a) {
  const s = {},
    {
      idVal: n,
      nameVal: o,
      taskTitleVal: d,
      taskStatusVal: c,
      taskDescVal: i,
    } = e;
  return (
    r ||
      ($(n)
        ? /^\d+$/.test(n) ||
          (s.userID = "El documento debe contener solo números")
        : (s.userID = "Número de documento requerido"),
      a || (s.userID = "Debe buscar un usuario válido primero"),
      $(o) || (s.userName = "Nombre de usuario requerido")),
    $(d) || (s.taskName = "Nombre de la tarea requerido"),
    ["pendiente", "en proceso", "completada"].includes(c) ||
      (s.taskStatus =
        "Selecciona un estado válido: Pendiente, En proceso o Completada"),
    $(i) || (s.userTarea = "Descripción de la tarea requerida"),
    { isValid: Object.keys(s).length === 0, errors: s }
  );
}
function Ne(e) {
  if (!Array.isArray(e))
    throw new Error("Se esperaba un arreglo de tareas para exportar.");
  return JSON.stringify(e, null, 2);
}
function _e(e, r, a, s, n, o, d, c, i = !1) {
  const l = document.createElement("div");
  ((l.className = "tarea-card"),
    (l.dataset.id = e),
    (l.dataset.documento = c || ""));
  const u = document.createElement("div");
  u.className = "tarea-card__header";
  const f = document.createElement("div");
  f.className = "tarea-card__user";
  const m = document.createElement("div");
  ((m.className = "tarea-card__avatar"), (m.textContent = ue(a)));
  const E = document.createElement("span");
  ((E.className = "tarea-card__username"),
    (E.textContent = a),
    f.appendChild(m),
    f.appendChild(E));
  const v = document.createElement("span");
  ((v.className = "tarea-card__timestamp"),
    (v.textContent = d || ce()),
    u.appendChild(f),
    u.appendChild(v));
  const g = document.createElement("div");
  ((g.className = "tarea-card__title"), (g.textContent = s));
  const p = document.createElement("div");
  ((p.className = "tarea-card__content"), (p.textContent = n));
  const C = o || "pendiente",
    S = C.replace(" ", "-").toLowerCase(),
    k = C.charAt(0).toUpperCase() + C.slice(1),
    x = document.createElement("div");
  ((x.className = `tarea-card__status ${S}`), (x.textContent = k));
  const _ = document.createElement("div");
  if (((_.className = "tarea-card__botones"), i)) {
    const h = document.createElement("button");
    ((h.type = "button"),
      (h.className = "tarea-card__completar"),
      (h.dataset.action = "complete"));
    const b = (o || "").toLowerCase() === "completada";
    ((h.textContent = b ? "Completada ✓" : "Marcar completada"),
      (h.disabled = b),
      _.appendChild(h));
  } else {
    const h = document.createElement("button");
    ((h.type = "button"),
      (h.className = "tarea-card__eliminar"),
      (h.textContent = "Eliminar"),
      (h.dataset.action = "delete"));
    const b = document.createElement("button");
    ((b.type = "button"),
      (b.className = "tarea-card__editar"),
      (b.textContent = "Editar"),
      (b.dataset.action = "edit"),
      _.appendChild(h),
      _.appendChild(b));
  }
  return (
    l.appendChild(u),
    l.appendChild(g),
    l.appendChild(p),
    l.appendChild(x),
    l.appendChild(_),
    l
  );
}
function le(e, r) {
  const a = document.querySelector(`.tarea-card[data-id="${e}"]`);
  if (!a) return;
  const s = a.querySelector(".tarea-card__title");
  s && (s.textContent = r.title);
  const n = a.querySelector(".tarea-card__content");
  n && (n.textContent = r.description);
  const o = a.querySelector(".tarea-card__status");
  if (o) {
    const d = r.status || "pendiente",
      c = d.replace(" ", "-").toLowerCase(),
      i = d.charAt(0).toUpperCase() + d.slice(1);
    ((o.className = `tarea-card__status ${c}`), (o.textContent = i));
  }
  ((a.style.transition = "background-color 0.3s ease"),
    (a.style.backgroundColor = "var(--color-primary-lighter)"),
    setTimeout(() => {
      a.style.backgroundColor = "";
    }, 1e3));
}
function we(e, r) {
  const a = document.createElement("div");
  a.className = "perfil-card";
  const s = e,
    n = document.createElement("div");
  ((n.className = "perfil-card__avatar"), (n.textContent = ue(s)));
  const o = document.createElement("span");
  ((o.className = "perfil-card__username"), (o.textContent = s));
  const d = document.createElement("div");
  ((d.className = "perfil-card__user"), d.appendChild(n), d.appendChild(o));
  const c = document.createElement("button");
  return (
    (c.type = "button"),
    (c.className = "btn perfil-card__logout"),
    (c.textContent = "Cerrar Sesión"),
    c.addEventListener("click", () => {
      typeof r == "function" && r();
    }),
    a.appendChild(d),
    a.appendChild(c),
    a
  );
}
function N(e, r, a) {
  (e && (e.textContent = a), r == null || r.classList.add("error"));
}
function y(e, r) {
  (e && (e.textContent = ""), r == null || r.classList.remove("error"));
}
function ke(e, r) {
  (y(e.userIDError, e.userIDInput),
    y(e.userNameError, e.userNameInput),
    y(e.taskNameError, e.taskNameInput),
    y(e.taskStatusError, e.taskStatusInput),
    y(e.userTareaError, e.userTareaInput),
    r.userID && N(e.userIDError, e.userIDInput, r.userID),
    r.userName && N(e.userNameError, e.userNameInput, r.userName),
    r.taskName && N(e.taskNameError, e.taskNameInput, r.taskName),
    r.taskStatus && N(e.taskStatusError, e.taskStatusInput, r.taskStatus),
    r.userTarea && N(e.userTareaError, e.userTareaInput, r.userTarea));
}
function B(e) {
  const r = document.createElement("div");
  ((r.className = "notification"),
    (r.textContent = e),
    document.body.appendChild(r),
    setTimeout(() => {
      (r.classList.add("notification--hide"),
        setTimeout(() => r.remove(), 300));
    }, 3e3));
}
const xe = () => {
    Swal.fire({
      title: "Tarea registrada con exito!",
      text: "continua con la proxima!",
      icon: "success",
    });
  },
  de = () =>
    Swal.fire({
      title: "<strong>Vas a editar una tarea</strong>",
      icon: "info",
      html: "Los datos editados se actualizarán y verás los nuevos cambios reflejados.",
      showCloseButton: !0,
      showCancelButton: !0,
      focusConfirm: !1,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }),
  me = () => {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor completa todos los campos",
    });
  },
  Te = () => {
    Swal.fire({
      title: "Edicion exitosa!",
      text: "edicion completada",
      icon: "success",
    });
  },
  Be = () =>
    Swal.fire({
      title: "¿Estás seguro de eliminar?",
      text: "No se podrá revertir esta acción",
      icon: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡elimínalo!",
      cancelButtonText: "Cancelar",
    }).then((e) => e.isConfirmed),
  U = "http://localhost:3000/api";
async function Le() {
  try {
    const e = await fetch(`${U}/tasks`);
    if (!e.ok)
      throw new Error(
        `El servidor respondió con error ${e.status} al obtener las tareas`,
      );
    return await e.json();
  } catch (e) {
    throw e instanceof TypeError
      ? new Error(
          "No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000",
        )
      : e;
  }
}
async function De(e) {
  try {
    const r = await fetch(`${U}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
    });
    if (!r.ok)
      throw new Error(
        `El servidor respondió con error ${r.status} al crear la tarea`,
      );
    return await r.json();
  } catch (r) {
    throw r instanceof TypeError
      ? new Error(
          "No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000",
        )
      : r;
  }
}
async function Ae(e, r) {
  try {
    const a = await fetch(`${U}/tasks/${e}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    if (a.status === 404)
      throw new Error(`La tarea con ID ${e} no existe en el servidor`);
    if (!a.ok)
      throw new Error(
        `El servidor respondió con error ${a.status} al actualizar la tarea`,
      );
    return await a.json();
  } catch (a) {
    throw a instanceof TypeError
      ? new Error(
          "No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000",
        )
      : a;
  }
}
async function Ue(e) {
  try {
    const r = await fetch(`${U}/tasks/${e}`, { method: "DELETE" });
    if (r.status === 404)
      throw new Error(`La tarea con ID ${e} no existe o ya fue eliminada`);
    if (!r.ok)
      throw new Error(
        `El servidor respondió con error ${r.status} al eliminar la tarea`,
      );
    return !0;
  } catch (r) {
    throw r instanceof TypeError
      ? new Error(
          "No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000",
        )
      : r;
  }
}
async function pe() {
  try {
    const e = await fetch(`${U}/users`);
    if (!e.ok)
      throw new Error(
        `El servidor respondió con error ${e.status} al obtener los usuarios`,
      );
    return await e.json();
  } catch (e) {
    throw e instanceof TypeError
      ? new Error(
          "No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000",
        )
      : e;
  }
}
let T = null,
  P = [];
function F() {
  return T;
}
function j() {
  return P;
}
function L(e) {
  if (e === null) {
    T = null;
    return;
  }
  if (typeof e != "object") {
    console.warn("setCurrentUser: se esperaba un objeto de usuario o null");
    return;
  }
  if (!e.id || !e.documento) {
    console.warn(
      "setCurrentUser: el objeto no tiene id o documento válidos",
      e,
    );
    return;
  }
  T = e;
}
function qe(e) {
  if (!Array.isArray(e)) {
    console.warn("setCachedUsers: se esperaba un array");
    return;
  }
  P = e;
}
async function q(e) {
  const r = await pe();
  P = r;
  const a = r.find((s) => String(s.documento) === String(e)) ?? null;
  return (L(a), T);
}
async function Oe() {
  return await Le();
}
async function K(e, r, a, s = []) {
  if (!T) throw new Error("No hay usuario activo para asignar la tarea");
  const n = {
    userId: T.id,
    documento: T.documento,
    nombre_completo: T.nombre_completo,
    title: e,
    description: r,
    status: a,
    fecha: ce(),
    ...(s.length > 0 && { usuariosAsignados: s }),
  };
  return await De(n);
}
async function fe(e, r) {
  return await Ae(e, r);
}
async function $e(e) {
  return (await Ue(e), !0);
}
async function Ee() {
  const e = await pe();
  return (qe(e), e);
}
function Fe(e, r = "tareas_exportadas.json") {
  const a = new Blob([e], { type: "application/json" }),
    s = URL.createObjectURL(a),
    n = document.createElement("a");
  ((n.href = s),
    (n.download = r),
    document.body.appendChild(n),
    n.click(),
    document.body.removeChild(n),
    URL.revokeObjectURL(s));
}
let t = {},
  w = null;
function je(e) {
  t = e;
}
function V(e) {
  t.tareaCountEl &&
    (t.tareaCountEl.textContent = `${e} Tarea${e !== 1 ? "s" : ""}`);
}
function Ve() {
  var e;
  (e = t.emptyStateEl) == null || e.classList.add("hidden");
}
function Z() {
  var e;
  (e = t.emptyStateEl) == null || e.classList.remove("hidden");
}
function H() {
  (t.taskNameInput && (t.taskNameInput.disabled = !1),
    t.taskStatusInput && (t.taskStatusInput.disabled = !1),
    t.userTareaInput && (t.userTareaInput.disabled = !1));
}
function A() {
  t.userIDInput &&
    (t.taskNameInput &&
      ((t.taskNameInput.disabled = !0), (t.taskNameInput.value = "")),
    t.taskStatusInput &&
      ((t.taskStatusInput.disabled = !0),
      (t.taskStatusInput.value = "pendiente")),
    t.userTareaInput &&
      ((t.userTareaInput.disabled = !0), (t.userTareaInput.value = "")));
}
function Ie(e) {
  !t.usersList ||
    !e ||
    ((t.usersList.innerHTML = ""),
    j()
      .filter((r) => String(r.documento).startsWith(e))
      .forEach((r) => {
        const a = document.createElement("option");
        ((a.value = r.nombre_completo), t.usersList.appendChild(a));
      }));
}
async function Me() {
  if (t.docsList)
    try {
      let e = j();
      (e.length === 0 && (await q(""), (e = j())),
        (t.docsList.innerHTML = ""),
        e.forEach((r) => {
          const a = document.createElement("option");
          ((a.value = r.documento),
            (a.textContent = `${r.documento} - ${r.nombre_completo}`),
            t.docsList.appendChild(a));
        }));
    } catch (e) {
      console.error("Error al cargar sugerencias de documentos:", e);
    }
}
function ze() {
  var r;
  let e = document.getElementById("btnCancelEdit");
  (!e &&
    (r = t.submitBtnEl) != null &&
    r.parentElement &&
    ((e = document.createElement("button")),
    (e.id = "btnCancelEdit"),
    (e.type = "button"),
    (e.className = "btn btn--secondary"),
    (e.innerHTML = '<span class="btn__text">Cancelar</span>'),
    (e.style.marginLeft = "var(--spacing-sm)"),
    e.addEventListener("click", he),
    t.submitBtnEl.parentElement.appendChild(e)),
    e == null || e.classList.remove("hidden"));
}
function he() {
  var e;
  ((w = null),
    t.taskNameInput && (t.taskNameInput.value = ""),
    t.userTareaInput && (t.userTareaInput.value = ""),
    t.taskStatusInput && (t.taskStatusInput.value = "pendiente"),
    t.submitBtnEl &&
      ((t.submitBtnEl.querySelector(".btn__text").textContent =
        "Asignar Tarea"),
      t.submitBtnEl.classList.remove("btn--update")),
    (e = document.getElementById("btnCancelEdit")) == null ||
      e.classList.add("hidden"),
    t.tareaFormEl.reset(),
    t.userIDInput && (t.userIDInput.disabled = !1),
    t.userNameInput && (t.userNameInput.disabled = !1),
    y(t.taskNameError, t.taskNameInput),
    y(t.userTareaError, t.userTareaInput),
    y(t.taskStatusError, t.taskStatusInput));
}
async function M() {
  try {
    const e = await Oe();
    let r = !1,
      a = e;
    const s = sessionStorage.getItem("currentUser");
    if (s)
      try {
        const n = JSON.parse(s);
        n.rol !== "admin" &&
          ((r = !0),
          (a = e.filter((o) => {
            const d = String(o.userId) === String(n.id),
              c =
                Array.isArray(o.usuariosAsignados) &&
                o.usuariosAsignados.some((i) => String(i) === String(n.id));
            return d || c;
          })));
      } catch {}
    if (((t.tareasContainerEl.innerHTML = ""), a.length === 0)) {
      (Z(), V(0));
      return;
    }
    ([...a].reverse().forEach((n) => {
      const o = _e(
        n.id,
        n.userId,
        n.nombre_completo,
        n.title,
        n.description,
        n.status,
        n.fecha,
        n.documento,
        r,
      );
      t.tareasContainerEl.appendChild(o);
    }),
      V(a.length),
      Ve());
  } catch (e) {
    (console.error("Error al cargar tareas:", e), B(e.message), Z());
  }
}
async function O(e) {
  const r = e.target;
  if (r) {
    if (r === t.userIDInput) {
      const a = r.value.replace(/\D+/g, "");
      if (
        (r.value !== a && (r.value = a),
        y(t.userIDError, t.userIDInput),
        Ie(a),
        !a && t.usersList && (t.usersList.innerHTML = ""),
        a.length >= 3)
      )
        try {
          const s = await q(a);
          s
            ? (t.userNameInput &&
                ((t.userNameInput.value = s.nombre_completo),
                (t.userNameInput.disabled = !0)),
              H(),
              y(t.userIDError, t.userIDInput))
            : (t.userNameInput &&
                ((t.userNameInput.value = ""), (t.userNameInput.disabled = !1)),
              L(null),
              A());
        } catch (s) {
          console.error("Error al auto-completar usuario:", s);
        }
      else
        (t.userNameInput &&
          ((t.userNameInput.value = ""), (t.userNameInput.disabled = !1)),
          L(null),
          A());
    }
    (r === t.userNameInput && y(t.userNameError, t.userNameInput),
      r === t.taskNameInput && y(t.taskNameError, t.taskNameInput),
      r === t.taskStatusInput && y(t.taskStatusError, t.taskStatusInput),
      r === t.userTareaInput && y(t.userTareaError, t.userTareaInput));
  }
}
async function Je(e) {
  var u, f, m;
  if ((await de()).dismiss) return;
  const a = document.querySelector(`.tarea-card[data-id="${e}"]`);
  if (!a) return;
  const s =
      (u = a.querySelector(".tarea-card__title")) == null
        ? void 0
        : u.textContent,
    n =
      (f = a.querySelector(".tarea-card__content")) == null
        ? void 0
        : f.textContent,
    o = a.querySelector(".tarea-card__status"),
    d = o == null ? void 0 : o.textContent.toLowerCase().replace(/\s+/g, " "),
    c =
      (m = a.querySelector(".tarea-card__username")) == null
        ? void 0
        : m.textContent,
    i = a.dataset.documento;
  (t.taskNameInput && (t.taskNameInput.value = s || ""),
    t.userTareaInput && (t.userTareaInput.value = n || ""),
    t.taskStatusInput && (t.taskStatusInput.value = d || "pendiente"),
    t.userIDInput &&
      ((t.userIDInput.value = i || ""), (t.userIDInput.disabled = !0)),
    t.userNameInput &&
      ((t.userNameInput.value = c || ""), (t.userNameInput.disabled = !0)),
    (w = e),
    t.submitBtnEl &&
      ((t.submitBtnEl.querySelector(".btn__text").textContent =
        "Actualizar Tarea"),
      t.submitBtnEl.classList.add("btn--update")),
    ze(),
    H());
  const l = await q(i);
  l && L(l);
}
async function Pe(e) {
  if (await Be())
    try {
      (await $e(e), await M(), B("Tarea eliminada correctamente"));
    } catch (a) {
      (console.error("Error al eliminar la tarea:", a),
        alert(`No se pudo eliminar la tarea.
${a.message}`));
    }
}
async function He(e, r) {
  try {
    const a = await fe(e, { status: "completada" });
    (le(e, a),
      r && ((r.disabled = !0), (r.textContent = "Completada ✓")),
      B("Tarea marcada como completada"));
  } catch (a) {
    (console.error("Error al completar la tarea:", a),
      B("Error al actualizar la tarea: " + a.message));
  }
}
function Re(e) {
  const r = e.target.closest("button");
  if (!r) return;
  const a = r.closest(".tarea-card");
  if (!a) return;
  const s = a.dataset.id,
    n = r.dataset.action;
  (n === "edit" && s && (e.preventDefault(), Je(s)),
    n === "delete" && s && (e.preventDefault(), Pe(s)),
    n === "complete" && s && (e.preventDefault(), He(s, r)));
}
async function We() {
  try {
    const e = t.tareasContainerEl
      ? Array.from(
          t.tareasContainerEl.querySelectorAll(".tarea-card:not(.hidden)"),
        )
      : [];
    if (e.length === 0) {
      (de(), B("No hay tareas visibles para exportar"));
      return;
    }
    const r = e.map((n) => {
        var o, d, c, i, l, u;
        return {
          id: n.dataset.id,
          documento: n.dataset.documento,
          nombre_completo:
            ((o = n.querySelector(".tarea-card__username")) == null
              ? void 0
              : o.textContent) || "",
          title:
            ((d = n.querySelector(".tarea-card__title")) == null
              ? void 0
              : d.textContent) || "",
          description:
            ((c = n.querySelector(".tarea-card__content")) == null
              ? void 0
              : c.textContent) || "",
          status:
            ((l =
              (i = n.querySelector(".tarea-card__status")) == null
                ? void 0
                : i.textContent) == null
              ? void 0
              : l.toLowerCase()) || "",
          fecha:
            ((u = n.querySelector(".tarea-card__timestamp")) == null
              ? void 0
              : u.textContent) || "",
        };
      }),
      a = Ne(r),
      s = new Date().toISOString().split("T")[0];
    (Fe(a, `tareas_reporte_${s}.json`),
      B(
        `Exportación completada (${r.length} tarea${r.length !== 1 ? "s" : ""})`,
      ));
  } catch (e) {
    (console.error("Error al exportar tareas:", e),
      me(),
      B("Falló la exportación: " + e.message));
  }
}
async function Ke(e) {
  var f, m, E, v, g;
  e.preventDefault();
  const r = (f = t.userIDInput) == null ? void 0 : f.value.trim(),
    a = !t.userIDInput && !!t.usuariosAsignadosEl;
  if (!a && !F() && !w) {
    if (!r) {
      N(t.userIDError, t.userIDInput, "Ingrese un número de documento");
      return;
    }
    try {
      const p = await q(r);
      p
        ? (t.userNameInput &&
            ((t.userNameInput.value = p.nombre_completo),
            (t.userNameInput.disabled = !0)),
          H(),
          y(t.userIDError, t.userIDInput))
        : (A(),
          N(
            t.userIDError,
            t.userIDInput,
            "Usuario no encontrado en el sistema",
          ));
    } catch (p) {
      (console.error("Error al buscar usuario:", p),
        N(t.userIDError, t.userIDInput, p.message));
    }
    return;
  }
  if (!w && !a && F() && t.userIDInput && String(F().documento) !== String(r)) {
    (N(
      t.userIDError,
      t.userIDInput,
      "El documento no coincide con el usuario cargado",
    ),
      L(null),
      A());
    return;
  }
  if (a && !w)
    if (
      Array.from(
        ((m = t.usuariosAsignadosEl) == null ? void 0 : m.selectedOptions) ??
          [],
      ).map((C) => C.value).length === 0
    ) {
      const C = document.getElementById("usuariosAsignadosError");
      C &&
        (C.textContent =
          "Selecciona al menos un usuario para asignar la tarea");
      return;
    } else {
      const C = document.getElementById("usuariosAsignadosError");
      C && (C.textContent = "");
    }
  const s = F(),
    n = a ? JSON.parse(sessionStorage.getItem("currentUser") || "null") : s,
    o = {
      idVal: t.userIDInput
        ? t.userIDInput.value.trim()
        : ((n == null ? void 0 : n.documento) ?? "0"),
      nameVal: t.userNameInput
        ? t.userNameInput.value.trim()
        : ((n == null ? void 0 : n.nombre_completo) ?? "admin"),
      taskTitleVal:
        ((E = t.taskNameInput) == null ? void 0 : E.value.trim()) ?? "",
      taskStatusVal: ((v = t.taskStatusInput) == null ? void 0 : v.value) ?? "",
      taskDescVal:
        ((g = t.userTareaInput) == null ? void 0 : g.value.trim()) ?? "",
    },
    { isValid: d, errors: c } = be(o, w || a, n);
  if ((ke(t, c), !d)) {
    me();
    return;
  }
  const i = t.taskNameInput.value.trim(),
    l = t.userTareaInput.value.trim(),
    u = t.taskStatusInput.value;
  try {
    if (w) {
      const p = await fe(w, { title: i, description: l, status: u });
      (le(w, p),
        Te("✅ Tarea actualizada correctamente"),
        t.tareaFormEl.reset(),
        he(),
        await M());
    } else {
      let p;
      if (a) {
        const S = Array.from(t.usuariosAsignadosEl.selectedOptions).map(
            (h) => h.value,
          ),
          k = S[0],
          _ = j().find((h) => String(h.id) === String(k));
        if (!_) {
          B("No se encontraron datos del usuario seleccionado");
          return;
        }
        (L(_),
          (p = await K(i, l, u, S)),
          Array.from(t.usuariosAsignadosEl.options).forEach(
            (h) => (h.selected = !1),
          ));
      } else p = await K(i, l, u);
      (t.taskNameInput && (t.taskNameInput.value = ""),
        t.userTareaInput && (t.userTareaInput.value = ""),
        t.taskStatusInput && (t.taskStatusInput.value = "pendiente"),
        t.usuariosAsignadosEl &&
          Array.from(t.usuariosAsignadosEl.options).forEach(
            (C) => (C.selected = !1),
          ),
        xe(),
        await M());
    }
  } catch (p) {
    (console.error("Error en la operación:", p),
      N(t.userTareaError, t.userTareaInput, p.message));
  }
}
function G() {
  var n, o, d, c, i;
  const e =
      ((o =
        (n = document.getElementById("filterField")) == null
          ? void 0
          : n.value) == null
        ? void 0
        : o.toLowerCase()) || "",
    r =
      ((c =
        (d = document.getElementById("filterUser")) == null
          ? void 0
          : d.value) == null
        ? void 0
        : c.toLowerCase()) || "",
    a =
      (i = t.tareasContainerEl) == null
        ? void 0
        : i.querySelectorAll(".tarea-card");
  if (!a) return;
  let s = 0;
  if (
    (a.forEach((l) => {
      var p;
      const u = l.querySelector(".tarea-card__status"),
        f = l.querySelector(".tarea-card__username"),
        m =
          ((p = f == null ? void 0 : f.textContent) == null
            ? void 0
            : p.toLowerCase()) || "",
        E = e.replace(" ", "-"),
        v =
          !e || e === "todas" || (u == null ? void 0 : u.classList.contains(E)),
        g = !r || m.includes(r);
      v && g ? (l.classList.remove("hidden"), s++) : l.classList.add("hidden");
    }),
    t.tareaCountEl)
  ) {
    const l = a.length;
    (!e || e === "todas") && !r
      ? V(l)
      : (t.tareaCountEl.textContent = `${s} de ${l} Tareas`);
  }
}
function Q() {
  const e = document.getElementById("sortField"),
    r = document.getElementById("sortBtn");
  if (!t.tareasContainerEl || !e || !r) return;
  const a = Array.from(t.tareasContainerEl.querySelectorAll(".tarea-card")),
    s = e.value,
    o = (r.dataset.dir || "desc") === "desc" ? "asc" : "desc";
  ((r.dataset.dir = o),
    (r.textContent = `Ordenar ${o === "desc" ? "↓" : "↑"}`));
  const d = o === "desc" ? 1 : -1,
    c = { pendiente: 1, "en proceso": 2, completada: 3 };
  (a.sort((i, l) => {
    var f, m, E, v, g, p;
    let u = 0;
    if (s === "nombre") {
      const C =
          ((f = i.querySelector(".tarea-card__title")) == null
            ? void 0
            : f.textContent.toLowerCase()) || "",
        S =
          ((m = l.querySelector(".tarea-card__title")) == null
            ? void 0
            : m.textContent.toLowerCase()) || "";
      u = C.localeCompare(S);
    } else if (s === "estado") {
      const C =
          ((E = i.querySelector(".tarea-card__status")) == null
            ? void 0
            : E.textContent.toLowerCase()) || "pendiente",
        S =
          ((v = l.querySelector(".tarea-card__status")) == null
            ? void 0
            : v.textContent.toLowerCase()) || "pendiente",
        k = c[C] || 0,
        x = c[S] || 0;
      u = k - x;
    } else if (s === "fecha") {
      const C =
          ((g = i.querySelector(".tarea-card__timestamp")) == null
            ? void 0
            : g.textContent) || "",
        S =
          ((p = l.querySelector(".tarea-card__timestamp")) == null
            ? void 0
            : p.textContent) || "",
        k = (h) => {
          if (!h) return 0;
          const b = {
              enero: 0,
              febrero: 1,
              marzo: 2,
              abril: 3,
              mayo: 4,
              junio: 5,
              julio: 6,
              agosto: 7,
              septiembre: 8,
              octubre: 9,
              noviembre: 10,
              diciembre: 11,
            },
            R = h.match(/(\d+)\s+de\s+([a-zA-Z]+)\s+de\s+(\d+),\s+(\d+):(\d+)/);
          if (R) {
            const [Ge, Ce, ye, ge, ve, Se] = R,
              W = b[ye.toLowerCase()];
            if (W !== void 0) return new Date(ge, W, Ce, ve, Se).getTime();
          }
          return parseInt(i.dataset.id) || 0;
        },
        x = k(C);
      u = k(S) - x;
    }
    return u * d;
  }),
    a.forEach((i) => t.tareasContainerEl.appendChild(i)));
}
async function Ze() {
  var f;
  const e = document.querySelector(".messages-header");
  if (!e) return;
  let r = e.querySelector(".messages-header__actions");
  (r ||
    ((r = document.createElement("div")),
    (r.className = "messages-header__actions"),
    e.appendChild(r)),
    (r.innerHTML = ""));
  const a = document.createElement("div");
  a.className = "messages-header__controls";
  const s = document.createElement("select");
  ((s.id = "filterField"),
    (s.className = "messages-filter"),
    (s.title = "Filtrar tareas por estado"),
    [
      { value: "", text: "Todos los estados" },
      { value: "pendiente", text: "Pendiente" },
      { value: "en proceso", text: "En proceso" },
      { value: "completada", text: "Completada" },
    ].forEach((m) => {
      const E = document.createElement("option");
      ((E.value = m.value), (E.textContent = m.text), s.appendChild(E));
    }),
    a.appendChild(s));
  const o = sessionStorage.getItem("currentUser");
  if (o && ((f = JSON.parse(o)) == null ? void 0 : f.rol) === "admin") {
    const m = document.createElement("select");
    ((m.id = "filterUser"),
      (m.className = "messages-filter"),
      (m.title = "Filtrar tareas por usuario"));
    const E = document.createElement("option");
    ((E.value = ""), (E.textContent = "Todos los usuarios"), m.appendChild(E));
    try {
      (await Ee()).forEach((g) => {
        const p = document.createElement("option");
        ((p.value = g.nombre_completo.toLowerCase()),
          (p.textContent = g.nombre_completo),
          m.appendChild(p));
      });
    } catch {}
    a.appendChild(m);
  }
  const c = document.createElement("div");
  c.className = "messages-sort-container";
  const i = document.createElement("select");
  ((i.id = "sortField"),
    (i.className = "messages-sort-select"),
    (i.title = "Ordenar por criterio"),
    [
      { value: "fecha", text: "Fecha" },
      { value: "estado", text: "Estado" },
      { value: "nombre", text: "Nombre" },
    ].forEach((m) => {
      const E = document.createElement("option");
      ((E.value = m.value), (E.textContent = m.text), i.appendChild(E));
    }),
    c.appendChild(i));
  const u = document.createElement("button");
  ((u.id = "sortBtn"),
    (u.type = "button"),
    (u.className = "btn btn--sort"),
    (u.title = "Cambiar dirección de ordenamiento"),
    (u.textContent = "Ordenar ↓"),
    (u.dataset.dir = "desc"),
    c.appendChild(u),
    a.appendChild(c),
    r.appendChild(a),
    console.log("Controles de filtrado y ordenamiento creados"));
}
const I = {
  tareaFormEl: document.getElementById("tareaForm"),
  userIDInput: document.getElementById("userID"),
  userNameInput: document.getElementById("userName"),
  taskNameInput: document.getElementById("taskName"),
  userTareaInput: document.getElementById("userTarea"),
  taskStatusInput: document.getElementById("taskStatus"),
  submitBtnEl: document.getElementById("submitBtn"),
  exportBtnEl: document.getElementById("exportBtn"),
  userIDError: document.getElementById("userIDError"),
  userNameError: document.getElementById("userNameError"),
  taskNameError: document.getElementById("taskNameError"),
  taskStatusError: document.getElementById("taskStatusError"),
  userTareaError: document.getElementById("userTareaError"),
  tareasContainerEl: document.getElementById("tareasContainer"),
  usersList: document.getElementById("usersList"),
  emptyStateEl: document.getElementById("emptyState"),
  filterField: document.getElementById("filterField"),
  filterUserEl: document.getElementById("filterUser"),
  sortFieldEl: document.getElementById("sortField"),
  sortBtnEl: document.getElementById("sortBtn"),
  docsList: document.getElementById("docsList"),
  tareaCountEl: document.getElementById("tareaCount"),
  usuariosAsignadosEl: document.getElementById("usuariosAsignados"),
};
var X;
(X = I.tareaFormEl) == null || X.addEventListener("submit", Ke);
var Y;
(Y = I.userIDInput) == null || Y.addEventListener("input", O);
var ee;
(ee = I.userIDInput) == null || ee.addEventListener("focus", Me);
var te;
(te = I.userNameInput) == null || te.addEventListener("input", O);
var re;
(re = I.taskNameInput) == null || re.addEventListener("input", O);
var ae;
(ae = I.userTareaInput) == null || ae.addEventListener("input", O);
var ne;
(ne = I.taskStatusInput) == null || ne.addEventListener("change", O);
var se;
(se = I.tareasContainerEl) == null || se.addEventListener("click", Re);
var oe;
(oe = I.exportBtnEl) == null || oe.addEventListener("click", We);
var ie;
(ie = I.userNameInput) == null ||
  ie.addEventListener("focus", () => {
    var r;
    const e =
      ((r = I.userIDInput) == null ? void 0 : r.value.replace(/\D+/g, "")) ||
      "";
    Ie(e);
  });
const z = document.getElementById("loginForm"),
  J = document.getElementById("loginID"),
  D = document.getElementById("loginIDError");
z == null ||
  z.addEventListener("submit", async (e) => {
    e.preventDefault();
    const r = (J == null ? void 0 : J.value.trim()) ?? "";
    if (!r) {
      D && (D.textContent = "Ingrese su número de documento");
      return;
    }
    try {
      const a = await q(r);
      if (!a) {
        D && (D.textContent = "Usuario no encontrado");
        return;
      }
      (sessionStorage.setItem("userName", a.nombre_completo),
        sessionStorage.setItem("currentUser", JSON.stringify(a)),
        a.rol === "admin"
          ? (window.location.href = "html/form_admin_task.html")
          : (window.location.href = "html/user_tasks.html"));
    } catch (a) {
      D && (D.textContent = a.message);
    }
  });
document.addEventListener("DOMContentLoaded", async () => {
  var s, n, o, d;
  const e = sessionStorage.getItem("currentUser");
  if (e)
    try {
      L(JSON.parse(e));
    } catch {}
  (await Ze(),
    (I.filterField = document.getElementById("filterField")),
    (I.filterUserEl = document.getElementById("filterUser")),
    (I.sortFieldEl = document.getElementById("sortField")),
    (I.sortBtnEl = document.getElementById("sortBtn")),
    (s = I.filterField) == null || s.addEventListener("change", G),
    (n = I.filterUserEl) == null || n.addEventListener("change", G),
    (o = I.sortFieldEl) == null || o.addEventListener("change", Q),
    (d = I.sortBtnEl) == null || d.addEventListener("click", Q));
  const r = document.getElementById("perfilContainer");
  if (r) {
    const c = sessionStorage.getItem("userName") || "Usuario",
      i = we(c, () => {
        (sessionStorage.clear(), (window.location.href = "../index.html"));
      });
    r.appendChild(i);
  }
  const a = document.getElementById("usuariosCheckboxList");
  if (I.usuariosAsignadosEl && a)
    try {
      (await Ee()).forEach((i) => {
        const l = document.createElement("option");
        ((l.value = i.id), I.usuariosAsignadosEl.appendChild(l));
        const u = document.createElement("div");
        u.className = "usuario-checkbox-item";
        const f = document.createElement("input");
        ((f.type = "checkbox"), (f.id = `user-cb-${i.id}`), (f.value = i.id));
        const m = document.createElement("label");
        ((m.htmlFor = `user-cb-${i.id}`),
          (m.textContent = `${i.nombre_completo} (${i.documento})`),
          u.appendChild(f),
          u.appendChild(m),
          a.appendChild(u));
      });
    } catch (c) {
      console.error("Error al cargar usuarios para los checkboxes:", c);
    }
  (je(I), A(), V(0), I.tareasContainerEl && M());
});
