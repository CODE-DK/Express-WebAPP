const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price.textContent);
};

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

//Create JQuery obj
const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', evt => {
        if (evt.target.classList.contains('js-remove')) {
            const id = evt.target.dataset.id;

            fetch(`/card/remove/${id}`, {method: 'delete'})
                .then(res => res.json())
                .then(card => {
                    if (card.courses.length) {
                        //обновляем таблицу
                        const html = card.courses.map(item => {
                            return `
                            <tr>
                                <td>${item.title}</td>
                                <td>${item.count}</td>
                                <td>
                                    <botton class="btn btn-small js-remove" data-id="${item.id}">Удалить</botton>
                                </td>
                            </tr>
                           `;
                        }).join('');

                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = '<p>Корзина пуста</p>';
                    }
                });
        }
    });
}