export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  content: string;
  relatedTool?: { href: string; label: string };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "que-es-ugc-y-por-que-las-marcas-lo-necesitan",
    title: "Qué es el UGC y por qué las marcas de e-commerce lo necesitan en 2026",
    description:
      "UGC (contenido generado por usuarios/creadores) es hoy el formato que más convierte en Amazon, Mercado Libre y TikTok Shop. Te explicamos qué es y por qué no es lo mismo que publicidad tradicional.",
    category: "E-commerce",
    publishedAt: "2026-10-01",
    readingMinutes: 5,
    content: `El UGC (User Generated Content, o contenido generado por creadores) es cualquier video o foto de producto hecho por una persona real que lo usa, no por el equipo creativo de la marca. Un unboxing, una reseña honesta, un "cómo lo uso en mi rutina diaria" - eso es UGC.

## Por qué funciona mejor que el contenido de marca

Las personas confían más en otras personas que en anuncios producidos por una marca. Un video grabado con celular, con una persona real hablando directo a cámara, se siente como una recomendación de un conocido - no como un comercial. Eso baja la guardia de quien lo ve y sube la intención de compra.

## No es lo mismo que "influencer marketing"

El influencer marketing tradicional paga por alcance: cuántos seguidores tiene la persona. El UGC paga por **contenido**, no por alcance - muchas veces ni siquiera se publica desde la cuenta del creador, sino que la marca lo usa directamente en su ficha de producto, en sus anuncios de Meta Ads o TikTok Ads, o en su tienda de TikTok Shop. Eso significa que podés trabajar con un creador que tiene pocos seguidores pero que graba contenido excelente.

## Dónde se usa el UGC en e-commerce

- **Ficha de producto**: videos cortos que muestran el producto en uso, antes/después, o unboxing.
- **Anuncios pagados**: el UGC rinde mejor que el contenido de estudio en Meta Ads y TikTok Ads porque no se siente como publicidad.
- **TikTok Shop y Mercado Libre**: los videos de afiliados generan ventas directas desde el mismo video.
- **Redes propias de la marca**: reposteando contenido real de clientes o creadores contratados.

## Cómo empezar

No necesitás un presupuesto grande de agencia. Podés empezar con 2-3 creadores pequeños, pedirles un formato específico (unboxing, reseña, demo) y medir qué contenido convierte mejor antes de escalar. Si querés ver perfiles reales de creadores con su portafolio de UGC y marketplaces verificados, [explorá el catálogo de creadores de creator.hub](/creators).

Si buscás profundizar en estrategia completa de e-commerce (no solo UGC), en [Estudio Ecommerce](https://estudioecommerce.com.mx) encontrás recursos enfocados en crecimiento de tiendas online.`,
    relatedTool: { href: "/creators", label: "Explorar creadores verificados" },
  },
  {
    slug: "como-armar-tu-primer-creator-passport",
    title: "Cómo armar tu primer Creator Passport y conseguir tus primeras marcas",
    description:
      "Tu Creator Passport es tu carta de presentación frente a las marcas. Te explicamos qué poner, qué evitar, y cómo compartirlo para conseguir tus primeras colaboraciones pagadas.",
    category: "Para creadores",
    publishedAt: "2026-10-02",
    readingMinutes: 6,
    content: `Si sos creador de contenido y querés que las marcas te tomen en serio, necesitás algo más que tu perfil de TikTok o Instagram: necesitás una carta de presentación comercial. Eso es el Creator Passport.

## Qué debe tener sí o sí

- **Portfolio real**: 3 a 6 videos de ejemplo, aunque no hayan sido pagados. Unboxing, reseña o demo de productos que ya usás.
- **Marketplaces conectados**: si ya tenés cuenta en Amazon, Mercado Libre o TikTok Shop, conectala - las marcas buscan creadores que ya puedan vender directo.
- **Tarifa base**: poner un número, aunque sea orientativo, filtra marcas serias de las que solo quieren contenido gratis a cambio de "exposición".
- **Categorías claras**: belleza, fitness, hogar, tecnología - lo que sea que realmente hagas, no todo a la vez.

## El error más común

Creadores nuevos llenan su perfil de datos que no tienen forma de respaldar: "miles de ventas generadas", "alto engagement" sin cifras reales. Es mejor mostrar menos y que sea verificable, que mucho que no se pueda comprobar. Un perfil honesto con pocas campañas completadas genera más confianza que uno inflado.

## Cómo compartirlo

Tu Creator Passport tiene un link público - ponelo en tu bio de TikTok/Instagram, mandalo directo cuando una marca te escribe por DM, o usalo en tu firma de correo si ya trabajás con marcas por email. Entre más fácil sea para una marca ver tu trabajo sin pedirte nada extra, más rápido cierran contigo.

## Primeros pasos concretos

1. Agregá 3 videos reales a tu portfolio (no hace falta que sean pagados).
2. Conectá al menos un marketplace (TikTok Shop, Amazon o Mercado Libre).
3. Definí tu tarifa base, aunque la ajustes después.
4. Compartí tu link en tu bio.

[Creá tu Creator Passport gratis](/register?role=CREATOR) y empezá a recibir invitaciones de marcas.`,
    relatedTool: { href: "/register?role=CREATOR", label: "Crear mi Creator Passport" },
  },
  {
    slug: "tiktok-shop-para-creadores-como-activar-tu-tienda",
    title: "TikTok Shop para creadores: cómo activar tu tienda y empezar a vender",
    description:
      "Guía práctica para creadores que quieren activar TikTok Shop, entender cómo funciona la comisión por afiliado, y qué tipo de contenido vende más dentro de la app.",
    category: "TikTok Shop",
    publishedAt: "2026-10-03",
    readingMinutes: 6,
    content: `TikTok Shop le permite a un creador ganar comisión por cada venta que genera, directamente desde un video o un live, sin tener que sacar a la persona de la app para que compre.

## Cómo funciona la comisión

Cuando te afilias a un producto dentro de TikTok Shop, obtenés un link/código especial. Si alguien compra ese producto después de ver tu video (dentro de una ventana de tiempo definida por la plataforma), recibís un porcentaje de esa venta. La marca define ese porcentaje - varía mucho según categoría y producto, así que conviene revisar la comisión antes de promocionar algo.

## Qué formato de contenido vende más

- **Demostración de uso real**: mostrar el producto resolviendo un problema concreto, no solo "mirá qué bonito".
- **Antes/después**: funciona muy bien en belleza, fitness y productos para el hogar.
- **Reseña honesta**: incluso mencionar un "pero" (algo que no te encantó) genera más confianza y más conversión que una reseña 100% positiva.
- **Lives de venta**: los creadores que hacen lives mostrando varios productos seguidos suelen generar picos de ventas fuertes en poco tiempo.

## Disponibilidad para Live y colaboraciones

Si ya tenés tu TikTok Shop activo, marcá en tu Creator Passport si estás **disponible para lives** y/o **disponible para colaboraciones por producto** - muchas marcas buscan específicamente creadores que puedan hacer una transmisión en vivo de su producto, y si no lo indicás, simplemente no te van a encontrar.

## Errores comunes al empezar

- Afiliarse a demasiados productos sin probarlos primero.
- No revisar el porcentaje de comisión antes de grabar contenido.
- No marcar tu disponibilidad real (lives, colaboraciones) en tu perfil público.

Si querés que marcas te encuentren directamente para colaboraciones de TikTok Shop, [actualizá tu Creator Passport](/profile) y marcá tus marketplaces activos.`,
    relatedTool: { href: "/tools/tiktok-shop", label: "Calculadora de comisión TikTok Shop" },
  },
  {
    slug: "tiktok-shop-para-marcas-guia-rapida",
    title: "TikTok Shop para marcas: guía rápida para lanzar tu catálogo",
    description:
      "Si tu marca quiere vender en TikTok Shop, esto es lo que necesitás resolver primero: catálogo, comisión para afiliados, y cómo conseguir creadores que realmente vendan.",
    category: "Para marcas",
    publishedAt: "2026-10-04",
    readingMinutes: 5,
    content: `TikTok Shop combina contenido y venta en un mismo lugar: el video, el carrito y el pago ocurren sin salir de la app. Para una marca, eso significa que el contenido de tus creadores deja de ser "solo marketing" y se vuelve tu canal de ventas directo.

## Antes de lanzar tu catálogo

- Definí qué productos tienen sentido para video corto - productos visuales, con un "antes/después" claro o un uso fácil de mostrar en 30-60 segundos, funcionan mejor que productos complejos de explicar.
- Fijá tu porcentaje de comisión para afiliados pensando en el margen real del producto, no solo en "lo que paga la competencia".
- Preparate para mandar producto físico a creadores - sin producto en mano, no hay contenido real.

## Cómo conseguir creadores que vendan, no solo que posteen

No todos los creadores con buena cámara saben vender. Buscá creadores que:
- Ya tengan marketplace de TikTok Shop activo y verificado.
- Muestren en su portfolio contenido de formato "demo" o "reseña", no solo estético.
- Tengan categoría relacionada a tu producto (no mandes tu producto de skincare a un creador de tecnología).

## El error más caro

Mandar producto a 20 creadores al azar esperando que "algo funcione" es la forma más cara de probar TikTok Shop. Es mejor empezar con 3-5 creadores bien seleccionados, medir qué contenido convierte, y recién ahí escalar con los que mejor funcionaron.

[Explorá creadores con TikTok Shop activo](/creators?marketplace=TIKTOK_SHOP) y filtrá por categoría para tu primera campaña.`,
    relatedTool: { href: "/creators", label: "Buscar creadores por marketplace" },
  },
  {
    slug: "mercado-libre-afiliados-como-ganar-comision",
    title: "Mercado Libre afiliados: cómo ganar comisión promocionando productos",
    description:
      "Cómo funciona el programa de afiliados de Mercado Libre, qué tipo de contenido conviene hacer, y cómo combinarlo con tu Creator Passport para conseguir marcas directo.",
    category: "Mercado Libre",
    publishedAt: "2026-10-05",
    readingMinutes: 5,
    content: `El programa de afiliados de Mercado Libre te permite ganar una comisión por cada venta que se genera a través de tu link de afiliado, sin necesidad de tener tu propio inventario.

## Cómo empezar

Te registrás en el programa de afiliados de Mercado Libre, generás tu link único para el producto que quieras promocionar, y lo compartís donde tenga sentido: un video, una historia, una reseña escrita. Cuando alguien compra usando ese link dentro del período de seguimiento, recibís tu comisión.

## Qué contenido funciona mejor

- **Comparativas**: "este producto vs este otro" genera mucha intención de compra porque ayuda a decidir.
- **Reseñas de uso real**: mostrar el producto después de usarlo un tiempo, no recién llegado.
- **Guías de compra por categoría**: "los 5 mejores audífonos por menos de X precio" funciona muy bien para tráfico orgánico de búsqueda.

## Cómo combinarlo con marcas directas

Tener tu cuenta de Mercado Libre conectada en tu Creator Passport le muestra a las marcas que ya sabés generar ventas reales en ese marketplace - no es lo mismo contratar a un creador que nunca ha vendido nada ahí, que a uno que ya tiene historial. Agregá tu marketplace de Mercado Libre a tu perfil y subí tu link cuando una marca te lo pida directamente para una colaboración paga, además de tu link genérico de afiliados.

## Un consejo final

No te afilies a productos que no comprarías vos mismo. La audiencia nota rápido cuando una reseña es forzada, y eso le hace daño a tu credibilidad a largo plazo - que es justo lo que te permite seguir generando ventas después.

[Agregá Mercado Libre a tu Creator Passport](/profile) para que las marcas vean tu historial de afiliado.`,
    relatedTool: { href: "/profile", label: "Conectar mi cuenta de Mercado Libre" },
  },
  {
    slug: "amazon-influencer-vs-amazon-afiliados",
    title: "Amazon Influencer vs Amazon Afiliados: diferencias que debes conocer",
    description:
      "Son dos programas distintos con requisitos y beneficios diferentes. Te explicamos la diferencia para que sepas cuál te conviene según tu situación como creador.",
    category: "Amazon",
    publishedAt: "2026-10-06",
    readingMinutes: 5,
    content: `Mucha gente confunde el Programa de Afiliados de Amazon con el Programa de Influencers de Amazon, y aunque están relacionados, no son lo mismo.

## Amazon Afiliados (Associates)

Es el programa general: cualquier persona con un sitio web, blog o redes sociales puede generar links de afiliado para cualquier producto de Amazon y ganar comisión por las ventas generadas. No requiere un mínimo de seguidores para empezar a generar links, aunque Amazon puede revisar tu cuenta después de un período si no generás ventas.

## Amazon Influencer

Es un programa más selectivo, pensado para creadores con presencia activa en redes sociales (Instagram, TikTok, YouTube). Si te aceptan, obtenés tu propia "tienda" dentro de Amazon con tu usuario (tu storefront), donde podés organizar productos recomendados en colecciones, y suele requerir aprobación basada en tu actividad en redes.

## Cuál te conviene

Si estás empezando y no tenés gran audiencia todavía, Afiliados es el punto de entrada más accesible - podés generar links desde el día uno. Si ya tenés una audiencia activa y constante, aplicar a Influencer te da una tienda más profesional que podés compartir como tu "catálogo recomendado", lo cual es un gran argumento de venta frente a marcas.

## Cómo esto conecta con marcas directas

Ninguno de los dos programas reemplaza trabajar directo con marcas - son complementarios. Una marca puede pagarte una tarifa fija o comisión extra por un video específico, además de lo que ya generás con tus links de afiliado. Tener tu cuenta de Amazon conectada en tu Creator Passport le muestra a la marca que ya tenés experiencia real vendiendo en ese marketplace.

[Conectá tu cuenta de Amazon a tu perfil](/profile) para que las marcas vean tu historial.`,
    relatedTool: { href: "/tools/amazon-fba", label: "Calculadora de rentabilidad Amazon FBA" },
  },
  {
    slug: "cuanto-cobrar-por-un-video-ugc",
    title: "Cuánto cobrar por un video UGC: guía de tarifas para creadores en México",
    description:
      "No hay un precio único para un video UGC - depende del formato, los derechos de uso y tu experiencia. Te damos un marco para definir tu tarifa base sin subvaluarte.",
    category: "Para creadores",
    publishedAt: "2026-10-07",
    readingMinutes: 6,
    content: `Una de las preguntas que más recibimos de creadores nuevos: "¿cuánto cobro?". No hay una tabla universal, pero sí hay variables claras que deberías considerar antes de poner un número.

## Variables que afectan tu tarifa

- **Formato**: un unboxing simple de 15-30 segundos cuesta menos que un video con guion, varias tomas y edición.
- **Derechos de uso**: si la marca solo quiere publicarlo en TikTok Shop es distinto a si también lo va a usar como anuncio pagado en Meta Ads por meses - eso debería costar más.
- **Exclusividad**: si te piden no trabajar con marcas de la competencia por un tiempo, eso tiene un costo extra.
- **Cantidad de revisiones**: definí desde el inicio cuántas rondas de cambios incluye tu tarifa.
- **Tu portfolio y resultados**: un creador con campañas completadas y buena calificación puede cobrar más que uno sin historial.

## Un marco simple para empezar

Si estás empezando, poné una tarifa base conservadora para tus primeras 3-5 colaboraciones pagadas - el objetivo ahí es construir historial verificable en tu Creator Passport, no maximizar ingreso. Después de eso, subí tu tarifa gradualmente según la demanda real que recibís.

## La trampa de "trabajar por producto"

Trabajar solo a cambio de producto está bien al inicio para construir portfolio, pero si ya tenés historial de campañas completadas y seguís aceptando solo producto, estás dejando dinero en la mesa. Usá el filtro de "tipo de compensación" en tu perfil para dejar claro si aceptás producto, tarifa fija, comisión, o una combinación.

## No negocies en privado sin dejar registro

Una colaboración acordada dentro de la plataforma queda registrada - eso te protege si hay una disputa sobre lo que se acordó. Evitá cerrar los términos finales solo por DM.

[Definí tu tarifa base en tu Creator Passport](/profile) y dejá claro qué tipo de compensación aceptás.`,
    relatedTool: { href: "/tools/roi-campanas", label: "Evaluar el ROI de una campaña" },
  },
  {
    slug: "como-hacer-un-brief-de-campana",
    title: "Cómo hacer un brief de campaña que los creadores realmente entiendan",
    description:
      "Un brief confuso genera contenido que no sirve. Te damos la estructura mínima que necesita un brief para que un creador entregue exactamente lo que tu marca necesita.",
    category: "Para marcas",
    publishedAt: "2026-10-08",
    readingMinutes: 5,
    content: `La causa número uno de contenido UGC que "no sirve" no es que el creador sea malo - es un brief mal armado. Si no sabés comunicar lo que necesitás, no podés esperar que el creador lo adivine.

## Lo mínimo que debe tener un brief

- **Objetivo del contenido**: ¿es para tu ficha de producto, para TikTok Shop, para un anuncio pagado? El formato cambia según dónde se va a usar.
- **Duración aproximada**: 15 segundos, 30 segundos, 60 segundos - sé específico.
- **Qué debe mostrar el producto**: el uso real, un problema que resuelve, una comparación.
- **Tono**: ¿casual y espontáneo, o más estructurado con guion?
- **Qué evitar**: menciones de la competencia, lenguaje prohibido, elementos de marca que no querés que aparezcan.
- **Fecha de entrega y días de revisión incluidos.**

## Un error común: pedir "contenido auténtico" sin dar dirección

Pedir "algo auténtico y natural" sin más contexto deja al creador adivinando qué significa eso para tu marca específica. Es mejor compartir 2-3 ejemplos de contenido que te guste (de cualquier marca) como referencia de tono, y dejar que el creador aplique su estilo dentro de esa dirección.

## Usá el flujo de deliverables de la plataforma

En vez de mandar el brief por WhatsApp y esperar que no se pierda, subilo como parte de la colaboración - así queda registrado, el creador puede subir su entrega directamente ahí, y vos podés aprobarla o pedir ajustes con comentarios específicos sobre esa entrega.

[Creá tu primera campaña](/campaigns) con un brief estructurado y empezá a recibir aplicaciones de creadores.`,
    relatedTool: { href: "/campaigns", label: "Crear una campaña" },
  },
  {
    slug: "errores-comunes-al-contratar-creadores",
    title: "7 errores comunes al contratar creadores de contenido (y cómo evitarlos)",
    description:
      "De pagar antes de tiempo a no definir derechos de uso. Estos son los errores que más le cuestan dinero y tiempo a las marcas que empiezan a trabajar con creadores.",
    category: "Para marcas",
    publishedAt: "2026-10-09",
    readingMinutes: 6,
    content: `Trabajar con creadores de contenido parece simple hasta que algo sale mal. Estos son los errores que vemos repetirse más seguido.

## 1. No revisar el portfolio antes de contratar

Un perfil con buenos seguidores no garantiza buen contenido. Revisá el portfolio real del creador antes de cerrar - es la única forma de saber si su estilo encaja con tu marca.

## 2. No definir derechos de uso por escrito

¿El contenido es solo para la cuenta del creador, o también podés usarlo como anuncio pagado? Si no lo acordás antes, vas a tener el problema después.

## 3. Pagar el 100% por adelantado sin ningún entregable

Es razonable adelantar parte del pago para cubrir el costo del producto, pero el pago completo debería estar ligado a la entrega aprobada - para eso sirve el flujo de deliverables.

## 4. No dar feedback específico cuando algo no funciona

"No me convence" no ayuda a nadie. Si una entrega no cumple el brief, decí exactamente qué parte y por qué - el creador puede ajustar rápido si sabe qué cambiar.

## 5. Ignorar la categoría del creador

Mandar un producto de skincare a un creador de gaming porque "tiene muchos seguidores" casi nunca convierte. La afinidad de categoría importa más que el tamaño de audiencia.

## 6. No verificar si el creador ya tiene el marketplace activo

Si tu campaña depende de que el contenido se pueda vincular directo a TikTok Shop o Mercado Libre, confirmá que el creador ya tiene esa cuenta activa y verificada antes de contratar.

## 7. Tratar la primera colaboración como la última

La mejor forma de encontrar creadores que realmente funcionan para tu marca es probar con varios en campañas pequeñas antes de comprometer presupuesto grande con uno solo.

[Explorá el catálogo de creadores verificados](/creators) y filtrá por marketplace, categoría y presupuesto.`,
    relatedTool: { href: "/creators", label: "Explorar creadores verificados" },
  },
  {
    slug: "roi-real-del-ugc-vs-publicidad-tradicional",
    title: "ROI real del UGC comparado con publicidad pagada tradicional",
    description:
      "No se trata de elegir uno u otro - el UGC suele rendir mejor como creativo dentro de tu publicidad pagada. Te explicamos cómo pensar el ROI de ambos juntos.",
    category: "E-commerce",
    publishedAt: "2026-10-10",
    readingMinutes: 6,
    content: `Una pregunta frecuente de marcas que empiezan: "¿me conviene más invertir en UGC o en publicidad pagada tradicional?". La pregunta en sí parte de una confusión - no son sustitutos, son complementarios.

## El UGC es creativo, no es el canal

El UGC no reemplaza tu inversión en Meta Ads o TikTok Ads - **es el material creativo** que ponés dentro de esos anuncios. La pregunta real no es "UGC o ads pagados", sino "¿qué creativo uso dentro de mis ads pagados?". Ahí es donde el contenido real de creadores suele superar al contenido de estudio, porque se siente menos como publicidad.

## Cómo pensar el ROI correctamente

El costo de producir un video UGC es generalmente mucho menor que una producción de estudio tradicional (sin equipo de filmación, locación, talento de agencia). Si ese mismo video, al usarse como creativo de anuncio, genera una tasa de conversión más alta que tu creativo anterior, el ROI combinado (costo del UGC + costo de medios pagados) mejora en dos frentes a la vez: menor costo de producción y mejor conversión.

## Cómo medirlo en la práctica

- Probá el mismo presupuesto de medios pagados con un creativo de estudio vs un creativo UGC, y compará conversión.
- Usá nuestra [calculadora de ROI de campañas](/tools/roi-campanas) para comparar el costo total de la campaña contra el valor generado.
- No evalúes un solo video - probá contenido de 3-5 creadores distintos antes de decidir cuál formato funciona mejor para tu producto específico.

## La trampa de medir solo "me gusta" y comentarios

Un video puede tener pocas interacciones en la cuenta del creador y aun así convertir muy bien como anuncio pagado a una audiencia distinta. No descartes contenido solo por sus métricas orgánicas - probalo como creativo pagado antes de decidir.

Si querés profundizar en estrategia de medios pagados y estructura de campañas de e-commerce en general, en [Estudio Ecommerce](https://estudioecommerce.com.mx) hay contenido enfocado específicamente en eso.`,
    relatedTool: { href: "/tools/roi-campanas", label: "Calculadora de ROI de campañas" },
  },
  {
    slug: "como-calcular-tu-cac-y-ltv-antes-de-una-campana",
    title: "Cómo calcular tu CAC y LTV antes de lanzar una campaña con creadores",
    description:
      "Antes de invertir en UGC o creadores necesitás dos números clave: cuánto te cuesta conseguir un cliente, y cuánto vale ese cliente a lo largo del tiempo.",
    category: "E-commerce",
    publishedAt: "2026-10-11",
    readingMinutes: 6,
    content: `Si no sabés tu CAC (costo de adquisición de cliente) y tu LTV (valor de vida del cliente), estás invirtiendo en campañas a ciegas - no importa si es UGC, publicidad pagada, o ambos.

## Qué es el CAC

El CAC es cuánto te cuesta, en promedio, conseguir un cliente nuevo: todo lo que gastaste en marketing (medios pagados, pago a creadores, producción) dividido entre los clientes nuevos que conseguiste en ese período.

## Qué es el LTV

El LTV es cuánto vale ese cliente a lo largo del tiempo que se queda comprándote, no solo en su primera compra. Un cliente que compra una vez y no vuelve vale mucho menos que uno que recompra varias veces al año.

## Por qué importan juntos

Un CAC de $200 pesos puede ser carísimo si tu cliente solo te compra una vez por $250 pesos (casi no ganás nada). Pero ese mismo CAC de $200 pesos puede ser una ganga si ese cliente te vuelve a comprar varias veces al año y su LTV real es de $2,000 pesos. El número aislado no te dice nada - la relación entre los dos es lo que importa.

## Cómo aplicarlo a tus campañas con creadores

Antes de pagarle a un creador una tarifa fija o comisión, calculá cuánto estás dispuesto a pagar por cliente nuevo según tu LTV real. Eso te da un techo claro de cuánto invertir en una campaña específica, y te evita pagar de más por contenido que no se traduce en clientes rentables a largo plazo.

Usá nuestras calculadoras gratuitas:
- [Calculadora de CAC](/tools/cac)
- [Calculadora de LTV](/tools/ltv)

Con esos dos números, cualquier decisión sobre invertir en creadores deja de ser una apuesta y se vuelve una decisión con datos reales.`,
    relatedTool: { href: "/tools/cac", label: "Calculadora de CAC" },
  },
  {
    slug: "unboxing-resena-o-demo-que-formato-convierte-mas",
    title: "Unboxing, reseña o demo: qué formato de UGC convierte más en e-commerce",
    description:
      "No todos los formatos de video funcionan igual para todos los productos. Te explicamos cuándo usar cada uno según tu categoría.",
    category: "E-commerce",
    publishedAt: "2026-10-12",
    readingMinutes: 5,
    content: `Pedirle a un creador "un video UGC" sin especificar el formato es como pedirle a un cocinero "algo de comer" sin decir qué plato - va a salir algo, pero capaz no es lo que necesitabas.

## Unboxing

Mostrar el producto recién llegado, abrir el empaque, primera impresión. Funciona muy bien para productos donde el empaque y la primera experiencia importan (tecnología, belleza, productos premium). Es el formato más fácil y rápido de producir.

## Reseña

Opinión después de haber usado el producto un tiempo. Funciona mejor para productos donde el resultado no es inmediato (skincare, suplementos, productos de limpieza con resultados a mediano plazo). Una reseña honesta, con algún punto negativo mencionado, convierte más que una 100% positiva porque se siente más real.

## Demostración (demo)

Mostrar el producto resolviendo un problema específico en tiempo real. Es el formato que mejor funciona para productos donde el "cómo se usa" no es obvio, o donde el resultado se puede mostrar visualmente en el momento (herramientas, gadgets, productos para el hogar).

## Cómo elegir según tu producto

- Producto con empaque atractivo y primera impresión fuerte → **unboxing**.
- Producto con resultado que se nota con el tiempo → **reseña**.
- Producto que resuelve un problema visible al instante → **demo**.
- Producto que se puede comparar directamente con otro → combiná reseña + comparativa.

## Un consejo final

No te limites a un solo formato por campaña. Probá los tres con el mismo producto y distintos creadores - vas a encontrar rápido cuál convierte mejor para tu caso específico, y eso te ahorra presupuesto en futuras campañas.

[Buscá creadores por categoría](/creators) y revisá su portfolio para ver qué formato dominan mejor.`,
    relatedTool: { href: "/creators", label: "Buscar creadores por categoría" },
  },
  {
    slug: "guion-para-video-ugc-que-vende",
    title: "Guion para video UGC que vende: estructura paso a paso",
    description:
      "Un video UGC que convierte sigue una estructura, aunque se sienta espontáneo. Te damos el esqueleto de guion que podés adaptar a cualquier producto.",
    category: "Para creadores",
    publishedAt: "2026-10-13",
    readingMinutes: 5,
    content: `Un video UGC que convierte no es improvisado al 100% - tiene una estructura clara detrás, aunque al verlo se sienta natural y espontáneo.

## La estructura básica (15-45 segundos)

- **Gancho (primeros 2-3 segundos)**: una pregunta, una afirmación fuerte, o mostrar el resultado final antes de explicar cómo se logró. Si no enganchás en los primeros segundos, nadie llega al resto.
- **Problema**: nombrá el problema específico que la persona que ve el video probablemente tiene.
- **Producto como solución**: mostralo resolviendo ese problema exacto, no solo "mirá qué lindo es".
- **Prueba o resultado**: mostrá el antes/después, o el uso real funcionando.
- **Cierre con llamado a la acción claro**: "lo encontrás en el link", "disponible en mi TikTok Shop", etc.

## Cómo sonar natural sin perder estructura

Escribí el guion como guía de puntos clave, no palabra por palabra. Grabalo varias veces diciendo las ideas con tus propias palabras cada vez, y quedate con la toma que suene más natural - eso es lo que da la sensación de espontaneidad mientras mantenés la estructura que convierte.

## Errores que bajan la conversión

- Empezar con "hola, hoy les traigo..." - es un gancho débil, perdés a la audiencia en los primeros segundos.
- No mostrar el producto en uso real, solo hablar de él.
- Terminar sin decir claramente dónde comprar o cómo conseguirlo.

## Practicá con tu propio contenido

Grabá el mismo producto con 2-3 estructuras de guion distintas y compará cuál genera más comentarios, guardados o, si tenés acceso a los datos, más clics al link. Con el tiempo vas a desarrollar tu propia fórmula que funciona mejor para tu estilo y tu audiencia.

[Agregá tus mejores videos a tu Creator Passport](/profile) para que las marcas vean tu estilo antes de contratarte.`,
    relatedTool: { href: "/tools/guion-ugc", label: "Generador de guion UGC" },
  },
  {
    slug: "como-negociar-con-marcas-sin-perder-el-control",
    title: "Cómo negociar con marcas sin perder el control de tu contenido",
    description:
      "Negociar no es solo el precio. Te explicamos qué puntos dejar claros antes de aceptar una colaboración para que no termines cediendo más de lo que pensabas.",
    category: "Para creadores",
    publishedAt: "2026-10-14",
    readingMinutes: 5,
    content: `Negociar con una marca no se trata solo de pedir más dinero - se trata de dejar claros los términos antes de empezar, para que no haya sorpresas después.

## Puntos que siempre deberías dejar claros

- **Duración de los derechos de uso**: ¿pueden usar tu contenido para siempre, o solo por un período definido?
- **Dónde se puede usar**: ¿solo en su tienda, o también como anuncio pagado en Meta/TikTok Ads?
- **Exclusividad**: si te piden no trabajar con la competencia, eso debería reflejarse en el pago.
- **Número de revisiones incluidas**: definilo antes de empezar, no cuando ya te están pidiendo la quinta versión.
- **Plazo de entrega realista**: no aceptes plazos que no podés cumplir solo por cerrar la colaboración.

## Cómo decir que no sin quemar la relación

Si una marca te pide algo que no encaja con tu tarifa o tus condiciones, proponé una alternativa concreta en vez de un "no" seco: "puedo hacerlo por ese precio si reducimos a una sola revisión" o "ese uso extendido tiene un costo adicional de X". La mayoría de las marcas serias van a negociar de vuelta en buena forma.

## Dejá todo registrado

Negociar los términos finales solo por mensajes privados es arriesgado - si hay un desacuerdo después, no tenés con qué respaldarte. Cerrar los términos dentro de la plataforma, donde queda registro de lo acordado, te protege a vos y a la marca por igual.

## Tu tarifa no es fija para siempre

Está bien ajustar tu tarifa según el proyecto, el alcance de derechos de uso, o la complejidad del guion - no tenés que cobrar lo mismo por todo. Lo importante es que vos sepas por qué cobrás lo que cobrás en cada caso.

[Revisá tus colaboraciones activas](/dashboard) y dejá claros los términos antes de aceptar la próxima.`,
    relatedTool: { href: "/dashboard", label: "Ver mis colaboraciones" },
  },
  {
    slug: "checklist-primera-colaboracion-creador",
    title: "Checklist para tu primera colaboración como creador de contenido",
    description:
      "Antes de aceptar tu primera colaboración paga, asegurate de tener esto resuelto. Una checklist simple para evitar los errores más comunes de los que recién empiezan.",
    category: "Para creadores",
    publishedAt: "2026-10-15",
    readingMinutes: 4,
    content: `Tu primera colaboración paga es un momento clave - hacerla bien te abre la puerta a más marcas; hacerla mal puede costarte una mala reseña pública en tu perfil.

## Antes de aceptar

- ¿Leíste el brief completo y entendés exactamente qué esperan?
- ¿Sabés qué tipo de compensación es (producto, tarifa fija, comisión, o combinación)?
- ¿Quedó claro el plazo de entrega y cuántas revisiones incluye?
- ¿Sabés dónde van a usar tu contenido (solo su tienda, o también anuncios pagados)?

## Mientras producís el contenido

- Grabá en buena luz natural si es posible - mejora mucho la calidad percibida sin necesitar equipo caro.
- Mostrá el producto en uso real, no solo hablando de él.
- Grabá más tomas de las que creés necesitar - es más fácil elegir la mejor después que volver a grabar.

## Al momento de entregar

- Subí tu entrega dentro de la plataforma, no solo por WhatsApp - así queda registrado como parte del flujo de la colaboración.
- Si la marca pide un ajuste, aclarate exactamente qué cambiar antes de volver a grabar todo.

## Después de completar la colaboración

- Pedí tu reseña - las colaboraciones completadas con buena calificación suben tu Creator Score y te hacen más visible para futuras marcas.
- Agregá el contenido final (si tenés los derechos para mostrarlo) a tu portfolio público.

[Revisá tus aplicaciones y colaboraciones activas](/dashboard) para no perderte ningún paso.`,
    relatedTool: { href: "/dashboard", label: "Ver mi panel de creador" },
  },
  {
    slug: "marketplaces-p2p-vs-agencias-de-influencers",
    title: "Marketplaces P2P vs agencias de influencers: qué le conviene a tu marca",
    description:
      "Trabajar directo con creadores a través de un marketplace P2P no es lo mismo que contratar una agencia. Te explicamos las diferencias en costo, control y velocidad.",
    category: "Para marcas",
    publishedAt: "2026-10-16",
    readingMinutes: 5,
    content: `Si tu marca quiere trabajar con creadores de contenido, tenés básicamente dos caminos: una agencia de influencers, o un marketplace P2P donde contactás directo al creador. Cada uno tiene sentido en momentos distintos.

## Agencia de influencers

Una agencia gestiona todo por vos: selección de creadores, negociación, seguimiento de entregas. A cambio, cobra un fee de gestión sobre el presupuesto total, y el proceso suele ser más lento porque hay un intermediario en cada paso.

## Marketplace P2P

Contactás directo al creador, negociás directo, y pagás solo por la colaboración - sin fee de agencia de por medio. El proceso es más rápido porque no hay intermediarios, pero también significa que vos tenés que hacer el trabajo de revisar portfolios y elegir bien.

## Cuándo conviene cada uno

- **Agencia**: si tenés un presupuesto grande, poco tiempo interno para gestionar creadores, y querés que alguien más se encargue de todo el proceso.
- **Marketplace P2P**: si estás empezando, querés probar con presupuesto chico, iterar rápido con varios creadores, y no te importa invertir un poco más de tiempo en elegir y gestionar directo.

## Lo que no cambia en ninguno de los dos casos

Necesitás un brief claro, definir derechos de uso, y medir resultados - eso es trabajo de tu marca, no de la agencia ni del marketplace. La diferencia real está en quién hace la gestión intermedia, no en la calidad del contenido en sí.

[Explorá el catálogo de creadores verificados](/creators) y empezá a trabajar directo, sin fee de agencia.`,
    relatedTool: { href: "/creators", label: "Explorar creadores verificados" },
  },
  {
    slug: "reseñas-en-video-para-aumentar-conversion",
    title: "Cómo usar reseñas en video para aumentar conversión en tu tienda online",
    description:
      "Una reseña escrita convence, pero una reseña en video convence más rápido. Te explicamos dónde ponerla en tu tienda para que realmente mueva la aguja.",
    category: "E-commerce",
    publishedAt: "2026-10-17",
    readingMinutes: 5,
    content: `Las reseñas escritas funcionan, pero una reseña en video resuelve en segundos lo que un texto tarda párrafos en comunicar: cómo se ve, cómo se usa, y si realmente funciona.

## Dónde poner reseñas en video en tu tienda

- **En la ficha de producto, arriba del fold**: no la escondas al final de la página - mientras más arriba, más gente la ve antes de decidir.
- **En el checkout o carrito**: un video corto de reseña cerca del botón de compra puede reducir el abandono de carrito.
- **En tus anuncios pagados**: una reseña real en video suele rendir mejor que un anuncio tradicional de marca.

## Qué hace que una reseña en video convierta

- Que se vea real, no sobre-producida.
- Que mencione tanto lo bueno como algún punto a mejorar - genera más confianza que una reseña perfecta.
- Que muestre el producto en uso, no solo a la persona hablando a cámara.

## Cómo conseguir reseñas en video sin gastar de más

No necesitás contratar creadores grandes para esto - muchas veces alcanza con pedirle a clientes reales que ya compraron que graben una reseña corta a cambio de un descuento en su próxima compra, o trabajar con creadores pequeños que recién empiezan y cobran tarifas accesibles a cambio de construir su portfolio.

## Medí el impacto real

Antes de asumir que las reseñas en video "funcionan", probá una ficha de producto con y sin video de reseña, y compará la tasa de conversión. Los números te van a decir si vale la pena invertir más en este formato para tu categoría específica de producto.

[Buscá creadores dispuestos a hacer reseñas de producto](/creators) y empezá a sumar contenido real a tu tienda.`,
    relatedTool: { href: "/creators", label: "Buscar creadores para reseñas" },
  },
  {
    slug: "meta-ads-con-ugc-vs-contenido-de-marca",
    title: "Meta Ads con contenido UGC: por qué funciona mejor que el contenido de marca",
    description:
      "No es magia, es psicología: el contenido que se parece a lo que ya ves en tu feed convierte mejor que el que se ve como publicidad. Te explicamos cómo aplicarlo en Meta Ads.",
    category: "E-commerce",
    publishedAt: "2026-10-18",
    readingMinutes: 5,
    content: `Cuando alguien scrollea su feed de Instagram o Facebook, su cerebro ya está entrenado para distinguir "contenido de alguien que conozco o sigo" de "publicidad de marca". El contenido UGC se cuela en la primera categoría - y eso cambia todo.

## Por qué el contenido de estudio se siente como anuncio

Producción pulida, locación profesional, actor contratado sonriendo a cámara - todo eso le dice al cerebro de quien lo ve "esto es un anuncio", y activa el modo de ignorarlo rápido.

## Por qué el UGC rompe esa barrera

Un video grabado con celular, con alguien hablando directo a cámara en su cuarto o su cocina, se parece a cualquier otro contenido del feed. Eso baja la guardia de la persona que lo ve, y hace que preste atención un par de segundos más - que es justo lo que necesitás para que el mensaje llegue.

## Cómo estructurar tu campaña de Meta Ads con UGC

- Probá varios creadores distintos como creativos separados dentro de la misma campaña, no solo uno.
- Dejá correr cada creativo el tiempo suficiente para tener datos reales antes de pausar.
- No descartes un creativo solo porque tiene pocos "me gusta" en orgánico - medí conversión como anuncio pagado, que es una audiencia distinta.

## Combiná formatos

Un video UGC de reseña puede funcionar mejor en la parte alta del embudo (gente que no te conoce), mientras que una demo específica puede funcionar mejor en remarketing (gente que ya vio tu producto antes). No uses el mismo creativo para todo el embudo.

Si querés profundizar en estructura completa de campañas de Meta Ads para e-commerce, en [Estudio Ecommerce](https://estudioecommerce.com.mx) hay contenido específico sobre eso.

[Explorá creadores con contenido tipo reseña y demo](/creators) para tu próxima campaña de Meta Ads.`,
    relatedTool: { href: "/tools/inversion-publicitaria", label: "Calculadora de inversión publicitaria" },
  },
  {
    slug: "como-crecer-tu-cuenta-de-tiktok-vendiendo-productos",
    title: "Cómo crecer tu cuenta de TikTok vendiendo productos de otras marcas",
    description:
      "Ser creador de afiliados no tiene por qué frenar el crecimiento de tu cuenta - si lo hacés bien, puede acelerarlo. Te explicamos cómo balancear contenido propio y contenido patrocinado.",
    category: "TikTok Shop",
    publishedAt: "2026-10-19",
    readingMinutes: 5,
    content: `Un miedo común entre creadores que empiezan a trabajar con marcas: "¿si hago mucho contenido patrocinado, mi cuenta deja de crecer?". La respuesta depende más de cómo lo hacés que de cuánto lo hacés.

## La regla práctica: 80/20

Mantené la mayoría de tu contenido (alrededor del 80%) como contenido propio, genuino, que ya venías haciendo antes de trabajar con marcas. El contenido patrocinado o de afiliados (el otro 20%) se integra mejor cuando tu audiencia ya confía en vos por el resto de tu contenido.

## Elegí productos que ya usarías

La audiencia nota rápido cuando promocionás algo que claramente no te interesa de verdad. Afiliate o colaborá solo con productos que encajan genuinamente con lo que ya hacés - eso mantiene la confianza, y la confianza es lo que te permite seguir generando ventas.

## Usá el contenido patrocinado para mostrar valor, no solo para vender

Un video que enseña algo útil (cómo organizar tu clóset, una rutina de skincare, un truco de cocina) y que de paso incluye el producto que estás promocionando, funciona mejor que un video que es 100% venta directa. Tu audiencia se queda por el valor, no por la publicidad.

## Diversificá tus ingresos

No dependas de una sola marca o un solo producto. Combiná comisión de afiliados (TikTok Shop, Mercado Libre, Amazon) con colaboraciones pagadas directas con marcas - así ningún cambio en un solo programa te deja sin ingresos de un día para otro.

[Armá tu Creator Passport](/profile) mostrando tu mezcla de contenido propio y de marca, para que las marcas vean tu estilo real antes de contratarte.`,
    relatedTool: { href: "/tools/tiktok-shop", label: "Calculadora de comisión TikTok Shop" },
  },
  {
    slug: "tendencias-ecommerce-y-creadores-2027",
    title: "Tendencias de e-commerce y contenido de creadores para 2027",
    description:
      "Hacia dónde va el contenido generado por creadores dentro del e-commerce: más video corto, más venta dentro de la app, y más marcas trabajando directo sin intermediarios.",
    category: "E-commerce",
    publishedAt: "2026-10-20",
    readingMinutes: 5,
    content: `El e-commerce sigue moviéndose hacia un modelo donde el contenido y la venta ocurren en el mismo lugar, sin fricción entre ver un video y comprar el producto. Estas son las direcciones más claras para los próximos meses.

## Video corto como punto de entrada principal

Cada vez más compras en e-commerce empiezan con un video corto (TikTok Shop, Reels de Instagram) en vez de una búsqueda directa en Google o Amazon. Las marcas que no tienen presencia ahí están dejando pasar el canal donde su audiencia ya está descubriendo productos.

## Más marcas trabajando directo con creadores

El modelo de agencia tradicional sigue existiendo, pero cada vez más marcas - sobre todo las más chicas y medianas - prefieren contactar directo a creadores a través de marketplaces P2P, sin fee de intermediario, para poder iterar más rápido con más presupuesto disponible para el contenido en sí.

## El Creator Passport como estándar

Así como una marca espera ver un portfolio antes de contratar a un diseñador o un fotógrafo, cada vez más espera ver un portfolio verificado antes de contratar a un creador de UGC - con marketplaces conectados, historial de campañas, y reseñas reales de otras marcas.

## Contenido más honesto, menos producido

La tendencia sigue siendo hacia contenido que se siente menos como publicidad: reseñas con puntos negativos incluidos, demos imperfectas pero reales, en vez de producciones pulidas de estudio.

## Qué hacer con esto hoy

No necesitás esperar a que estas tendencias estén "confirmadas" para actuar - empezá a construir tu Creator Passport (si sos creador) o a trabajar directo con creadores verificados (si sos marca) ahora, mientras todavía es una ventaja competitiva y no un estándar que todos ya tienen.

[Creá tu cuenta gratis](/register) como creador o como marca y empezá hoy.`,
    relatedTool: { href: "/register", label: "Crear cuenta gratis" },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
