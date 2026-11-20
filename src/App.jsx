import { useState } from 'react'
import { Descriptions } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { Validation } from './validador/validation'
import FadeIn from './componentes/FadeIn'

function App() {
  const [pattern, setPattern] = useState('')
  const [valido, setValido] = useState(false)
  const [verificagem, setVerificagem] = useState(true)
  const [produto, setProduto] = useState(true)
  const [showProd, setShowProd] = useState(false)
  const [indisponivel, setIndie] = useState(false)

  function valIfProd() {
    const productExist = new Validation(pattern)
    const recebe = productExist.checkOnDIc()

    if (!recebe) {
      setProduto(false)
      return
    }

    if (recebe === 'Unknown') {
      toast.warning('Este produto precisa de um cadastro completo.')
      setProduto(recebe)
      return
    }

    setProduto(recebe)
    setShowProd(true)
  }

  function goBack() {
    setShowProd(false)
  }

  function res() {
    setPattern('')
    setValido(false)
    setVerificagem(true)
    setShowProd(false)
    setIndie(false)
    setProduto(true)
  }

  function validar(e) {
    e.preventDefault()
    const val = new Validation(pattern)

    if (!val.validationLength(pattern)) {
      toast.error('PN inválido. O código deve conter exatamente 50 caracteres.')
      return
    }

    const verificado = val.sliceBoundaries()
    if (!verificado) {
      toast.error('Não foi possível validar os segmentos do código.')
      return
    }

    if (verificado.aprovado) {
      toast.success('Código aprovado. Você já pode consultar a descrição do produto.', {
        onClose: () => {
          setVerificagem(false)
          setValido(true)
          setIndie(true)
        },
      })
    } else if (verificado.error) {
      toast.error(verificado.error.join(', '), {
        onClose: () => {
          setPattern('')
          setIndie(true)
        },
      })
    }
  }

  return (
    <main className="app-shell">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        newestOnTop
        closeOnClick
      />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Verifica, início">
          <span className="brand-mark">V</span>
          <span className="brand-name">verifica<span>.</span></span>
        </a>
        <div className="topbar-meta">
          <span className="status-dot" />
          <span>Sistema de validação</span>
        </div>
      </header>

      {!showProd ? (
        <section className="workspace" id="inicio">
          <div className="workspace-copy">
            <span className="eyebrow"><span className="eyebrow-line" /> CONTROLE E RASTREABILIDADE</span>
            <h1>Precisão em cada<br /><span>identificação.</span></h1>
            <p className="intro-copy">
              Valide o part number e consulte as informações do produto em um só lugar.
              Um processo simples, organizado e confiável.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">01</span>
                <div><strong>Validação estruturada</strong><small>Verificação dos segmentos do código.</small></div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">02</span>
                <div><strong>Consulta de cadastro</strong><small>Identificação dos atributos do produto.</small></div>
              </div>
            </div>
          </div>

          <div className="form-area">
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />
            <section className="validation-card">
              <div className="card-heading">
                <div className="card-icon"><span>⌁</span></div>
                <div>
                  <span className="card-kicker">ÁREA DE OPERAÇÃO</span>
                  <h2>Validar produto</h2>
                </div>
              </div>
              <p className="card-description">Insira o código PN para iniciar a análise de identificação.</p>

              <form onSubmit={validar} className="validation-form">
                <label htmlFor="part-number">Part number <span>•</span></label>
                <div className={`input-wrap ${indisponivel ? 'input-disabled' : ''}`}>
                  <span className="input-prefix">PN</span>
                  <input
                    id="part-number"
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    disabled={indisponivel}
                    placeholder="Digite ou cole o código..."
                    autoComplete="off"
                    spellCheck="false"
                    aria-describedby="pn-hint"
                  />
                  <span className="input-count">{pattern.length}/50</span>
                </div>
                <div className="field-hint" id="pn-hint">
                  <span className="hint-dot" /> O código deve conter 50 caracteres.
                </div>

                {produto === false && (
                  <div className="inline-alert error-alert">Código de produto ainda não cadastrado.</div>
                )}
                {produto === 'Unknown' && (
                  <div className="inline-alert warning-alert">Cadastro incompleto para este produto.</div>
                )}

                {verificagem && (
                  <button className="primary-button" type="submit" disabled={!pattern.trim()}>
                    <span>Validar código</span><span className="button-arrow">↗</span>
                  </button>
                )}

                {valido && (
                  <div className="next-actions">
                    <div className="approved-note"><span>✓</span> Código aprovado para consulta</div>
                    <FadeIn>
                      <button className="primary-button" type="button" onClick={valIfProd}>
                        <span>Consultar produto</span><span className="button-arrow">↗</span>
                      </button>
                    </FadeIn>
                    <button className="text-button" type="button" onClick={res}>Iniciar nova validação</button>
                  </div>
                )}
              </form>
              <div className="card-footer"><span className="lock-mark">◇</span> Ambiente de consulta • Acesso operacional</div>
            </section>
            <div className="form-caption"><span className="caption-rule" /> ORGANIZAÇÃO · CONFIANÇA · PRECISÃO</div>
          </div>
        </section>
      ) : (
        <section className="product-page">
          <FadeIn>
            <div className="product-topline">
              <button className="back-button" type="button" onClick={goBack}><span>←</span> Voltar à validação</button>
              <span className="record-status"><span /> PRODUTO IDENTIFICADO</span>
            </div>
            <div className="product-card">
              <div className="product-card-heading">
                <div>
                  <span className="card-kicker">REGISTRO DO PRODUTO</span>
                  <h1>Descrição do produto</h1>
                  <p>Confira os atributos associados ao part number validado.</p>
                </div>
                <div className="product-emblem">{String(produto.product || 'P').slice(0, 1).toUpperCase()}</div>
              </div>
              <div className="product-divider" />
              <div className="details-heading"><span className="details-heading-mark" /> INFORMAÇÕES CADASTRADAS</div>
              <Descriptions className="product-descriptions" bordered column={{ xs: 1, sm: 2, md: 2 }} layout="vertical" size="middle">
                <Descriptions.Item label="Produto"><span className="detail-value product-name">{produto.product}</span></Descriptions.Item>
                <Descriptions.Item label="Cor"><span className="detail-value">{produto.cor}</span></Descriptions.Item>
                <Descriptions.Item label="Tamanho"><span className="detail-value">{produto.size}</span></Descriptions.Item>
                <Descriptions.Item label="Marca"><span className="detail-value">{produto.brand}</span></Descriptions.Item>
              </Descriptions>
              <div className="product-card-footer">
                <span><span className="footer-check">✓</span> Informações recuperadas do cadastro</span>
                <button className="secondary-button" type="button" onClick={goBack}>Concluir consulta <span>→</span></button>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      <footer className="app-footer">
        <span>VERIFICA <span className="footer-separator">/</span> CONTROLE DE PRODUTOS</span>
        <span>PLATAFORMA DE VALIDAÇÃO</span>
      </footer>
    </main>
  )
}

export default App
