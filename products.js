const products = [
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Verde Agua/Rosa', 'Campo', 1499.90, '029427NXA3.jpg', 8],
  ['Nike', 'Nike Mercurial Superfly 10 Elite FG - Rosa', 'Campo', 1599.90, '098543CTA10.jpg', 5],
  ['Nike', 'Nike Tiempo Maestro Elite - Rosa', 'Campo', 1747.99, '098713CTA11.jpg', 4],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Preto/Azul', 'Campo', 0, '060728IDA2.jpg', 1],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Preto/Verde', 'Campo', 0, '060728IEA1.jpg', 1],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Vermelho/Preto', 'Campo', 0, '060728P1A12.jpg', 1],
  ['Nike', 'Nike Mercurial Vapor 16 Elite FG - Branco/Azul/Rosa', 'Campo', 0, '06072816A2.jpg', 1],
  ['Adidas', 'adidas Predator Elite Língua Dobrável - Branco (JP6248)', 'Campo', 0, 'adidas-predator-elite-jp6248.jpg', 1],
  ['Adidas', 'adidas Copa Pure IV Elite - Rosa (KI0586)', 'Campo', 0, 'adidas-copa-pure-iv-elite-ki0586.jpg', 1],
  ['Adidas', 'adidas F50 Hyperfast Elite - Branco (KJ3432)', 'Campo', 0, 'adidas-f50-hyperfast-elite-kj3432.jpg', 1],
  ['Adidas', 'adidas F50 Campo - Branco (IF1276)', 'Campo', 0, 'adidas-f50-if1276.jpg', 1]
].map(([brand, name, category, price, image, stock = 5, active = true], index) => ({
  id: index + 1,
  brand,
  name,
  category,
  price,
  image,
  stock,
  active,
  sizes: [38, 39, 40, 41, 42, 43, 44],
  description: 'Chuteira Nike original para campo. Confirme a disponibilidade, tamanho e caracteristicas com o atendimento MBM.'
}));
