const products = [
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Verde Agua/Rosa', 'Campo', '029427NXA3.jpg', 8],
  ['Nike', 'Nike Mercurial Superfly 10 Elite FG - Rosa', 'Campo', '098543CTA10.jpg', 5],
  ['Nike', 'Nike Tiempo Maestro Elite - Rosa', 'Campo', '098713CTA11.jpg', 4],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Preto/Azul', 'Campo', '060728IDA2.jpg', 1],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Preto/Verde', 'Campo', '060728IEA1.jpg', 1],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Vermelho/Preto', 'Campo', '060728P1A12.jpg', 1],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Branco/Azul/Rosa', 'Campo', '06072816A2.jpg', 1],
  ['Adidas', 'adidas Predator Elite Lingua Dobrável - Branco (JP6248)', 'Campo', 'adidas-predator-elite-jp6248.jpg', 1],
  ['Adidas', 'adidas Copa Pure IV Elite - Rosa (KI0586)', 'Campo', 'adidas-copa-pure-iv-elite-ki0586.jpg', 1],
  ['Adidas', 'adidas F50 Hyperfast Elite - Branco (KJ3432)', 'Campo', 'adidas-f50-hyperfast-elite-kj3432.jpg', 1],
  ['Adidas', 'adidas F50 Campo - Branco (IF1276)', 'Campo', 'adidas-f50-if1276.jpg', 1]
].map(([brand, name, category, image, stock = 5], index) => ({
  id: index + 1,
  brand,
  name,
  category,
  price: 439.90,
  image,
  stock,
  active: true,
  sizes: [38, 39, 40, 41, 42, 43, 44],
  description: `${brand} original para campo. Confirme disponibilidade, tamanho e características com o atendimento MBM.`
}));
