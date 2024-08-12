import amqp from 'amqp-connection-manager'

export const initRabbitMQ = () => {
  const connection = amqp.connect([process.env.URL_RABBITMQ])
  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err)
  })

  connection.on('connect', () => {
    console.log('RabbitMQ connected successfully')
  })

  connection.on('disconnect', (params) => {
    console.error('RabbitMQ disconnected:', params.err)
  })
  return connection
}
