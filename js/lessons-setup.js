/* Transforma as questões das lições em itens normais,
   para que entrem nas sessões rápidas e na revisão de erros. */
LESSONS.forEach(l => {
  l.items = l.qs.map(([q, o, a, e], k) => {
    const it = {id: l.id + "-" + (k+1), s: l.s, t: "quiz", q, o, a, e, src: "Lição: " + l.title, lesson: l.id};
    ITEMS.push(it); BY_ID[it.id] = it;
    return it;
  });
});
