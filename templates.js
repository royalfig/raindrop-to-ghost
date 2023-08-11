export function template(data) {
    const { link, cover, title, excerpt, domain, pubDate, height, width } = data;

    return `
<article class="rd-item">
    <a href="${link}" class="rd-item-link">
        <div class="rd-item-content">    
            <div class="rd-item-image">
                <img src="${cover}" alt="${title}" height=${height} width="${width}" loading="lazy" />
            </div>
            <div class="rd-item-body">
                <h3 class="rd-item-title">${title}</h3>
                <p class="rd-item-excerpt">${excerpt}</p>
            </div>
            <div class="rd-item-footer">
                <p class="rd-item-domain">${domain}</p>
                ${pubDate ? `<p class="rd-item-date">${pubDate}</p>` : ''}
            </div>
        </div>
        <svg class="rd-item-icon"><use href="#sm-icon-link"></use></svg>
    </a>
</article>`;

}