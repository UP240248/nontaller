/** Mobile uses an explicit menu; desktop navigation is already visible. */
export async function openNavigation(page){const button=page.getByRole('button',{name:'Abrir menú',exact:true});if(await button.isVisible())await button.click();}
